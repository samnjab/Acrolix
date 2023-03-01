export default function TypeWriter(){
    class TxtType {
        constructor(el, toRotate, period){
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
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
                delta = 500;
            }
            setTimeout(function() {
                that.tick();
            }, delta);
            
        }
    }
    window.onload = () => {
        const elements = document.getElementsByClassName('typeWrite')
        console.log('elements', elements)
        for(let i =0; i < elements.length; i++){
            let toRotate = elements[i].getAttribute('data-type')
            let period = elements[i].getAttribute('data-period')
            if (toRotate) {
                console.log(toRotate)
                new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
    }
    return(
        <>
            <a className='typeWrite' data-period='3000' data-type='[ "backronym: n. blend of back and acronym", "an acronym deliberately formed from a phrase whose initial letters spell out a particular word", "type to get started" ]'></a>
            <span className='wrap'></span>
        </>
    )
}