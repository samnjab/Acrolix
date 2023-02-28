import {useEffect, useRef, useState} from 'react'
export default function Canvas({windowDims, scrollTop}){
    const currentScroll = useRef(scrollTop)
    const prevScroll = useRef(scrollTop)
    useEffect(()=> {
        currentScroll.current = scrollTop
        console.log('current scroll is', currentScroll.current, 'prevScroll', prevScroll.current)
        const timer = setInterval(() => {
            prevScroll.current = currentScroll.current
        }, 2000)
        return () => {
            clearInterval(timer)
        }
    },[scrollTop])
    const canvasRef = useRef(null)
    class Circle {
        constructor(x, y, dx, dy, radius, color){
            this.x = x
            this.y = y
            this.dx = dx 
            this.dy = dy
            this.radius = radius
            this.color = color
        }
        draw(context){
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            context.fillStyle = this.color
            context.fill()
            context.closePath()
        }
        update(canvas, context){
            this.draw(context)
            if (currentScroll.current > prevScroll.current) {
                this.dy = -(Math.abs(this.dy))
            }else if (currentScroll.current < prevScroll.current){
                this.dy = Math.abs(this.dy)
            }
            if (this.x > canvas.width || this.x < 0){
                this.dx = -this.dx
            }
            if  (this.y < 0){
                this.y = Math.abs(this.y) + canvas.height
            }else if(this.y > canvas.height){
                this.y = -(this.y - canvas.height)
            }
            this.x += this.dx * 0.5 * (0.3 *(Math.sqrt(Math.sqrt(Math.max(currentScroll.current, prevScroll.current) - Math.min(currentScroll.current, prevScroll.current))) + 1))
            this.y += this.dy * 0.3 *(Math.sqrt(Math.sqrt(Math.max(currentScroll.current, prevScroll.current) - Math.min(currentScroll.current, prevScroll.current))) + 1)
        }
    }
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.width = windowDims[0]
        canvas.height = windowDims[1]
        const circleArray = []
        const colorArray = ['#FFF0F3', '#FFCCD5', '#FFB3C1', '#FF8FA3', '#FF758F', '#F7E3AF', '#FBF2DA']
        for (let i=0; i < 100; i++){
            const dy = (Math.random() - 0.5)
            const color = colorArray[Math.floor(Math.random() * colorArray.length)]
            let circle = new Circle(Math.random() * canvas.width, Math.random() * canvas.height , Math.sin(dy), dy, Math.random() * 3, color )
            circleArray.push(circle)
        }
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            circleArray.forEach(circle => {
                circle.update(canvas, context)
            })
            requestAnimationFrame(animate)
        }
        animate()
        return () => cancelAnimationFrame(animate)

    },[windowDims])
    return(
        <canvas ref={canvasRef}></canvas>
    )

}