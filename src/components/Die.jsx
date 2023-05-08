export default function Die(props) {
    const { value, isHeld, id} = props.die
    const styles = {
        backgroundColor: isHeld ? "#59E391" : "white",
    }

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={() => props.holdDice(id)}
        >
            <h2 className="die-num">{value}</h2>
        </div>
    )
}