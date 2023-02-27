import {useEffect, useRef, useState} from 'react'
export default function Canvas(){
    const canvasRef = useRef(null)
    const windowWidth = useState(window.innerWidth)
    const windowHeight = useState(window.innerHeight)
    const scrollY = useRef(window.scrollY)
    useEffect(()=> {
        console.log(scrollY)
    },[scrollY])
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
        update(context){
            this.draw(context)
            // this.x += this.dx
            // this.y += this.dy
        }
    }
    useEffect(() => {
        console.log('scrollY inside useEffect is', scrollY)
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        console.log(context)
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const circleArray = []
        for (let i=0; i <400; i++){
            let circle = new Circle((Math.random() * (canvas.width)/5) + 3 * canvas.width/4, (Math.random() * (canvas.height)/5) + canvas.height/4,1, 1, Math.random() * 1, '#ffffeb' )
            circleArray.push(circle)
        }
        console.log(circleArray)
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            circleArray.forEach(circle => {
                circle.update(context)
            })
            // requestAnimationFrame(animate)
        }
        animate()

    },[windowWidth, windowHeight])
    return(
        <canvas ref={canvasRef}></canvas>
    )

}