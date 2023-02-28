import {useEffect, useRef, useState} from 'react'
export default function Canvas({windowDims, scrollTop}){
    const prevScroll = useRef(scrollTop)
    useEffect(()=> {
        // console.log('prevscroll is', prevScroll)
        // console.log('scrollTop is', scrollTop)
        const timer = setInterval(() => {
            prevScroll.current = scrollTop
        }, 1000)
        return () => clearInterval(timer)
    })
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
            if (this.x > canvas.width || this.x < 0){
                this.dx = -this.dx
            }
            if (this.y > canvas.height || this.y < 0){
                this.dy = -this.dy
            }
            this.x += this.dx 
            console.log('difference is', Math.sin(scrollTop - prevScroll.current))
            this.y += this.dy + Math.sin(scrollTop - prevScroll.current)
        }
    }
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        console.log(context)
        canvas.width = windowDims[0]
        canvas.height = windowDims[1]
        const circleArray = []
        const colorArray = ['#FFF0F3', '#FFCCD5', '#FFB3C1', '#FF8FA3', '#FF758F', '#F7E3AF', '#FBF2DA']
        for (let i=0; i < 100; i++){
            const dy = (Math.random() - 0.5)* 0.3
            console.log('dy is', dy)
           
            const color = colorArray[Math.floor(Math.random() * colorArray.length)]
            let circle = new Circle(Math.random() * canvas.width, Math.random() * canvas.height , Math.sin(dy), dy, Math.random() * 2, color )
            circleArray.push(circle)
        }
        console.log(circleArray)
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            circleArray.forEach(circle => {
                circle.update(canvas, context)
            })
            requestAnimationFrame(animate)
        }
        animate()

    },[windowDims])
    return(
        <canvas ref={canvasRef}></canvas>
    )

}