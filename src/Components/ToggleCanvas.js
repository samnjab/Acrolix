export default function ToggleCanvas({canvasOn, setCanvasOn}){
    return(
         <div className='toggleCanvas'>
          <input type='checkbox' onClick={() => setCanvasOn(!canvasOn)} />
          {canvasOn ? <i className='toggleCanvasIcon canvasOn'>canvas</i> : <i className='toggleCanvasIcon canvasOff'>canvas</i>}
        </div>
    )
}