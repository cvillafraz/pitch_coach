import { createClient } from './supabase/client'
import { PaymentType } from './web3-config'

export interface PaymentRecord {
  id: string
  user_id: string
  transaction_hash: string
  payment_type: PaymentType
  amount: string
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
  confirmed_at?: string
  block_number?: number
}

export interface CreatePaymentData {
  transaction_hash: string
  payment_type: PaymentType
  amount: string
}

export class PaymentService {
  private supabase = createClient()

  async createPaymentRecord(data: CreatePaymentData): Promise<PaymentRecord | null> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Authentication error:', authError)
        return null
      }

      const { data: payment, error } = await this.supabase
        .from('payments')
        .insert({
          user_id: user.id,
          transaction_hash: data.transaction_hash,
          payment_type: data.payment_type,
          amount: data.amount,
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating payment record:', error)
        return null
      }

      return payment
    } catch (error) {
      console.error('Error creating payment record:', error)
      return null
    }
  }

  async updatePaymentStatus(
    transactionHash: string,
    status: 'confirmed' | 'failed',
    blockNumber?: number
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        confirmed_at: status === 'confirmed' ? new Date().toISOString() : null,
      }

      if (blockNumber) {
        updateData.block_number = blockNumber
      }

      const { error } = await this.supabase
        .from('payments')
        .update(updateData)
        .eq('transaction_hash', transactionHash)

      if (error) {
        console.error('Error updating payment status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating payment status:', error)
      return false
    }
  }

  async getUserPayments(limit = 20): Promise<PaymentRecord[]> {
    try {
      const { data: payments, error } = await this.supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user payments:', error)
        return []
      }

      return payments || []
    } catch (error) {
      console.error('Error fetching user payments:', error)
      return []
    }
  }

  async getPaymentByTxHash(transactionHash: string): Promise<PaymentRecord | null> {
    try {
      const { data: payment, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('transaction_hash', transactionHash)
        .single()

      if (error) {
        console.error('Error fetching payment by tx hash:', error)
        return null
      }

      return payment
    } catch (error) {
      console.error('Error fetching payment by tx hash:', error)
      return null
    }
  }

  async hasValidSubscription(): Promise<boolean> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return false
      }

      // Check for confirmed subscription payments in the last month/year
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const { data: payments, error } = await this.supabase
        .from('payments')
        .select('payment_type, confirmed_at')
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .in('payment_type', [PaymentType.MONTHLY_SUBSCRIPTION, PaymentType.YEARLY_SUBSCRIPTION])
        .order('confirmed_at', { ascending: false })

      if (error) {
        console.error('Error checking subscription:', error)
        return false
      }

      if (!payments || payments.length === 0) {
        return false
      }

      // Check if any payment is still valid
      for (const payment of payments) {
        const paymentDate = new Date(payment.confirmed_at)
        
        if (
          payment.payment_type === PaymentType.YEARLY_SUBSCRIPTION &&
          paymentDate > oneYearAgo
        ) {
          return true
        }
        
        if (
          payment.payment_type === PaymentType.MONTHLY_SUBSCRIPTION &&
          paymentDate > oneMonthAgo
        ) {
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Error checking subscription status:', error)
      return false
    }
  }

  async canAccessPremiumFeatures(): Promise<boolean> {
    try {
      // For now, allow access to premium features if user has any confirmed payment
      // In the future, you might want to implement more sophisticated access control
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return false
      }

      const { data: payments, error } = await this.supabase
        .from('payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .limit(1)

      if (error) {
        console.error('Error checking premium access:', error)
        return false
      }

      return payments && payments.length > 0
    } catch (error) {
      console.error('Error checking premium access:', error)
      return false
    }
  }
}