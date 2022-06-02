import React from 'react'

import Chord from '@tombatossals/react-chords/lib/Chord'

export default function MyChord({ className, chord, instrument, lite }) {
    return (
        <div className={className}>
            <Chord
                chord={chord}
                instrument={instrument}
                lite={lite}
            />
        </div >
    )
}