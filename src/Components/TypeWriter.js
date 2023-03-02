import { useEffect, useRef } from "react";

export default function TypeWriter({stopTyping, setStopTyping}){
    const stopCue = useRef(stopTyping)
    useEffect(()=>{
            stopCue.current = stopTyping
            class TxtType {
                constructor(el, toRotate, period){
                    this.toRotate = toRotate;
                    this.el = el;
                    this.loopNum = 0;
                    this.period = parseInt(period, 10) || 2000;
                    this.txt = '';
                    this.isDeleting = false;
                    if(!stopCue.current) this.tick();
                }
                tick(){
                    let i = this.loopNum % this.toRotate.length;
                    let fullTxt = this.toRotate[i];
                    if (this.isDeleting) {
                        this.txt = fullTxt.substring(0, this.txt.length - 1);
                    } else {
                        this.txt = fullTxt.substring(0, this.txt.length + 1);
                    }
                    this.el.innerHTML = '<p class="wrap">'+this.txt+'</p>';
                    let that = this;
                    let delta = Math.random() * 100;
        
                    if (this.isDeleting) { 
                        delta /= 2; 
                    }
                    if (!this.isDeleting && this.txt === fullTxt) {
                        delta = this.period;
                        this.isDeleting = true;
                    } else if (this.isDeleting && this.txt === '') {
                        this.isDeleting = false;
                        this.loopNum++;
                        if(this.loopNum >= this.toRotate.length){
                            setStopTyping(true)
                            stopCue.current = true
                        }
                        delta = 500;
                    }
                    setTimeout(function() {
                        if(!stopCue.current){
                            that.tick();
                        } 
                    }, delta);
                    
                }
            }
            // setStopTyping(false)
            const elements = document.getElementsByClassName('typeWrite')
        for(let i =0; i < elements.length; i++){
            let toRotate = elements[i].getAttribute('data-type')
            let period = elements[i].getAttribute('data-period')
            if (toRotate) {
                setTimeout(()=>{
                    new TxtType(elements[i], JSON.parse(toRotate), period);
                }, 3000)
            }
        }

    },[stopTyping])
    return(
        <>
            <a className='typeWrite' data-period='3000' data-type='[ "backronym: n. blend of back and acronym", "an acronym deliberately formed from a phrase whose initial letters spell out a particular word", "type to get started." ]'></a>
        </>
    )
}