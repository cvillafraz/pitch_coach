import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { createClient } from '@/lib/supabase/server'
import { CURRENT_NETWORK, PAYMENT_CONFIG, PaymentType, getPaymentDetails } from '@/lib/web3-config'

export async function POST(request: NextRequest) {
  try {
    const { txHash, paymentType } = await request.json()

    if (!txHash || !paymentType) {
      return NextResponse.json(
        { error: 'Transaction hash and payment type are required' },
        { status: 400 }
      )
    }

    // Validate payment type
    if (!Object.values(PaymentType).includes(paymentType)) {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    // Get user from Supabase auth
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Connect to Base network
    const provider = new ethers.JsonRpcProvider(CURRENT_NETWORK.rpc)

    try {
      // Get transaction details
      const tx = await provider.getTransaction(txHash)
      
      if (!tx) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        )
      }

      // Verify transaction details
      const paymentDetails = getPaymentDetails(paymentType)
      const expectedAmount = ethers.parseEther(paymentDetails.amount)
      
      const isValid = (
        tx.to?.toLowerCase() === PAYMENT_CONFIG.RECEIVER_ADDRESS.toLowerCase() &&
        tx.value === expectedAmount
      )

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid transaction details' },
          { status: 400 }
        )
      }

      // Get transaction receipt to check if confirmed
      const receipt = await provider.getTransactionReceipt(txHash)
      const isConfirmed = receipt && receipt.status === 1

      // Check if payment record already exists
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id, status')
        .eq('transaction_hash', txHash)
        .single()

      if (existingPayment) {
        // Update existing record if needed
        if (isConfirmed && existingPayment.status === 'pending') {
          await supabase
            .from('payments')
            .update({
              status: 'confirmed',
              confirmed_at: new Date().toISOString(),
              block_number: receipt?.blockNumber || null,
            })
            .eq('transaction_hash', txHash)
        }

        return NextResponse.json({
          success: true,
          status: isConfirmed ? 'confirmed' : 'pending',
          txHash,
          paymentType,
          blockNumber: receipt?.blockNumber || null,
        })
      }

      // Create new payment record
      const { data: payment, error: insertError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          transaction_hash: txHash,
          payment_type: paymentType,
          amount: paymentDetails.amount,
          status: isConfirmed ? 'confirmed' : 'pending',
          confirmed_at: isConfirmed ? new Date().toISOString() : null,
          block_number: receipt?.blockNumber || null,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating payment record:', insertError)
        return NextResponse.json(
          { error: 'Failed to record payment' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        status: isConfirmed ? 'confirmed' : 'pending',
        txHash,
        paymentType,
        blockNumber: receipt?.blockNumber || null,
        payment,
      })

    } catch (providerError) {
      console.error('Error verifying transaction on blockchain:', providerError)
      return NextResponse.json(
        { error: 'Failed to verify transaction on blockchain' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}