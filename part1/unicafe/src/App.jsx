import { useState } from 'react'


const Header = ({ header }) => {
    return (
        <h1>{header.text}</h1>
    )

}


const Button = ({ onClick, button }) => {

    return (
        <button onClick={onClick}>{button.name}</button>
    )
}

const StatsLine = ({ statName, statValue }) => {

    return (
        <tr><td>{statName}</td><td>{statValue}</td></tr>
    )
}

const Stats = ({ feedback }) => {
    const buttons = feedback.buttons
    const allRatings = feedback.totalCounter.counter
    const sumRatings = (buttons.reduce((el, currentValue) => el + currentValue.counter * currentValue.value, 0))
    if (allRatings == 0) {
        return (
            <div>
                <h1>Statistics</h1>
                <p>No feedback given yet</p>
            </div>)
    } else {
        return (
            <div>
                <h1>Statistics</h1>
                <table>
                    <thead>
                        <tr>
                            <th align='left'>stat</th>
                            <th align='left'>value</th>
                        </tr>
                    </thead>
                    <tbody>

                        <StatsLine statName={buttons[0].name} statValue={buttons[0].counter} />
                        <StatsLine statName={buttons[1].name} statValue={buttons[1].counter} />

                        <StatsLine statName={buttons[2].name} statValue={buttons[2].counter} />
                        <StatsLine statName={feedback.totalCounter.name} statValue={feedback.totalCounter.counter} />

                        <StatsLine statName={'average'} statValue={sumRatings / allRatings} />
                        <StatsLine statName={'positive'} statValue={(buttons[0].counter / allRatings) * 100 + '%'} />
                    </tbody>
                </table>
            </div>
        )
    }
}

const App = () => {
    const [countGood, setCountGood] = useState(0)
    const [countNeutral, setCountNeutral] = useState(0)
    const [countBad, setCountBad] = useState(0)
    const [countTotal, setCountTotal] = useState(0)

    const feedback = {
        'text': 'give feedback',
        'buttons':
            [{
                'name': 'good',
                'counter': countGood,
                'counterFunc': setCountGood,
                'value': 1

            }, {
                'name': 'neutral',
                'counter': countNeutral,
                'counterFunc': setCountNeutral,
                'value': 0

            }, {
                'name': 'bad',
                'counter': countBad,
                'counterFunc': setCountBad,

                'value': -1

            }],

        'totalCounter': {
            'name': 'all',
            'counter': countTotal,
            'counterFunc': setCountTotal
        }

    }

    const updateCount = (i) => {
        const button = feedback.buttons[i]
        const state = feedback.totalCounter
        const onClick = () => {

            button.counterFunc(button.counter + 1)
            state.counterFunc(state.counter + 1)
        }
        return onClick
    }

    return (
        <div>
            <Header header={feedback} />
            <Button onClick={updateCount(0)} button={feedback.buttons[0]} />
            <Button onClick={updateCount(1)} button={feedback.buttons[1]} />
            <Button onClick={updateCount(2)} button={feedback.buttons[2]} />

            <Stats feedback={feedback} />
        </div>
    )
}

export default App
