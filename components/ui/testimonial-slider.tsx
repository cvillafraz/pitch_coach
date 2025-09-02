"use client"

import { useState, useRef, useEffect } from "react"
import { Transition } from "@headlessui/react"

interface Testimonial {
    id: number
    name: string
    role: string
    company: string
    content: string
    avatar?: string
}

interface TestimonialSliderProps {
    testimonials: Testimonial[]
    autoPlay?: boolean
    autoPlayInterval?: number
}

export function TestimonialSlider({
    testimonials,
    autoPlay = true,
    autoPlayInterval = 2500
}: TestimonialSliderProps) {
    const testimonialsRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<number>(0)
    const [autorotate, setAutorotate] = useState<boolean>(autoPlay)

    useEffect(() => {
        if (!autorotate) return
        const interval = setInterval(() => {
            setActive(active + 1 === testimonials.length ? 0 : (active) => active + 1)
        }, autoPlayInterval)
        return () => clearInterval(interval)
    }, [active, autorotate, autoPlayInterval, testimonials.length])

    const heightFix = () => {
        if (testimonialsRef.current && testimonialsRef.current.parentElement)
            testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`
    }

    useEffect(() => {
        heightFix()
    }, [])

    if (!testimonials.length) return null

    return (
        <div className="mx-auto w-full max-w-4xl text-center">
            {/* Circular gradient background with rotating avatars */}
            <div className="relative h-32">
                <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-rose-400/25 before:via-orange-400/15 before:via-25% before:to-yellow-400/5 before:to-75%">
                    <div className="h-32 [mask-image:_linear-gradient(0deg,transparent,theme(colors.white)_20%,theme(colors.white))]">
                        {testimonials.map((testimonial, index) => (
                            <Transition
                                as="div"
                                key={index}
                                show={active === index}
                                className="absolute inset-0 -z-10 h-full"
                                enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                                enterFrom="opacity-0 -rotate-[60deg]"
                                enterTo="opacity-100 rotate-0"
                                leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                                leaveFrom="opacity-100 rotate-0"
                                leaveTo="opacity-0 rotate-[60deg]"
                                beforeEnter={() => heightFix()}
                            >
                                {testimonial.avatar ? (
                                    <img
                                        className="relative left-1/2 top-11 -translate-x-1/2 rounded-full w-14 h-14 object-cover"
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                    />
                                ) : (
                                    <div className="relative left-1/2 top-11 -translate-x-1/2 rounded-full w-14 h-14 bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-medium text-lg">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                            </Transition>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonial content */}
            <div className="mb-9 transition-all delay-300 duration-150 ease-in-out">
                <div className="relative flex flex-col" ref={testimonialsRef}>
                    {testimonials.map((testimonial, index) => (
                        <Transition
                            key={index}
                            show={active === index}
                            enter="transition ease-in-out duration-500 delay-200 order-first"
                            enterFrom="opacity-0 -translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                            leave="transition ease-out duration-300 delay-300 absolute"
                            leaveFrom="opacity-100 translate-x-0"
                            leaveTo="opacity-0 translate-x-4"
                            beforeEnter={() => heightFix()}
                        >
                            <div className="text-2xl font-light text-white before:content-['\201C'] after:content-['\201D'] leading-relaxed">
                                {testimonial.content}
                            </div>
                        </Transition>
                    ))}
                </div>
            </div>

        </div>
    )
}