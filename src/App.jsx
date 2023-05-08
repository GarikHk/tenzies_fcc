import React from 'react'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [time, setTime] = React.useState(0);
    const [running, setRunning] = React.useState(false);
    const [count, setCount] = React.useState(0)
    const [stats, setStats] = React.useState({
        rolls: 0,
        time: 0,
    })

    React.useEffect(() => {
        const allEqual = dice.every(obj => obj.value === dice[0].value && obj.isHeld === true);

        if (allEqual) {
            setRunning(false)
            setTenzies(true)
        } else if (dice.some(x => x.isHeld)) {
            setRunning(true)
        }
    }, [dice])

    React.useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1000);
            }, 1000);
        } else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    function generateNewDie() {
        return {
            value: Math.floor(Math.random() * 6) + 1,
            isHeld: false,
            id: nanoid(),
        }
    }

    function allNewDice() {
        const newDice = [];

        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie());
        }
        return newDice
    }

    function rollDice() {
        if (tenzies) {
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
            setTime(0)
            
            if (stats.rolls === 0 || count < stats.rolls) {
                setStats({
                    rolls: count,
                    time: time,
                })
            }
        } else {
            if (dice.some(x => x.isHeld)) {
                setCount(prevCount => prevCount + 1)
            }
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
        }
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => die.id == id ? {
            ...die,
            isHeld: !die.isHeld
        } : die))
    }

    const Stopwatch = (props) => {
        return (
            <>
                <span>{("0" + Math.floor((props.time / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((props.time / 1000) % 60)).slice(-2)}</span>
            </>
        )
    }
    console.log("Just rendered")

    return (
        <main>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {dice.map((item, index) => <Die key={index} die={item} holdDice={holdDice} />)}
            </div>
            <button
                className='roll-dice'
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className='stats'>
                <p className='roll-count'>Current Rolls: {count} (<Stopwatch time={time}/>)</p>
                <p className='best-rolls'> Best Game: {stats.rolls} (<Stopwatch time={stats.time}/>)</p>
            </div>

            {tenzies && <Confetti />}
        </main>
    );
}