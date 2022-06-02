import React, { useState, useEffect } from "react";
import { Tonal, Note, Scale, Key, } from "@tonaljs/tonal";
import NoteCalculator from './NoteMethods'
import s from './ChordsApp.module.scss'
import Select from "../UI/Select";
import MyChord from "../MyChord";
import chordsDB from '../../chords-db-master/lib/guitar.json';

export default function ChordFunctions() {

  /* Metodos  */
  const { freqToMidi, midi2Name, name2Midi, midi2Freq, setFrequency, setName } = window.Note().prototype

  const { notes: twelveNotes } = Scale.get("C chromatic")


  const [noteSelected, setNoteSelected] = useState("C")
  const [scaleSelected, setScaleSelected] = useState("major")
  const [instrumentSelected, setInstrumentSelected] = useState("guitar")

  const [isLoaded, setIsLoaded] = useState(false)


  const { notes, intervals, type } = Scale.get(`${noteSelected} ${scaleSelected}`)
  console.log('note and scale selected', Scale.get(`${noteSelected} ${scaleSelected}`))

  const handleOnChange = (event) => {
    const { value } = event.target
    if (event.target.id === "scaleInput") {
      setScaleSelected(value)
    } else {
      setNoteSelected(value)
    }
  }

console.log(chordsDB)
  const chord = chordsDB.chords.C[0].positions[0];

  const instrument = {
    strings: 6,
    fretsOnChord: 4,
    name: 'Guitar',
    keys: [],
    tunings: {
      standard: ['E', 'A', 'D', 'G', 'B', 'E']
    }
  }
  const lite = false // defaults to false if omitted
  return (
    <>

      <div className={s.tonalityWrapper}>
        <Select selectId="noteInput" label="Nota Base" options={twelveNotes} onChange={handleOnChange} />

        <Select selectId="scaleInput" label="Tonalidad" options={['major', 'minor']} onChange={handleOnChange} />

        {/* <Select selectId="instrumentInput" label="Instrumento" options={['guitar', 'piano']} onChange={(event) => setInstrumentSelected(event.target.value)} /> */}

      </div>
      <hr className={s.divisor}></hr>

      <div className={s.wrapperNotesAndProgressions}>
        <div className={s.notasDeEscala}>
          <label>Notas de: {noteSelected} {scaleSelected}:</label>
          <div className={s.keyNotesWrapper}>
            {notes.map((note) => {
              return <span key={note} className={s.notaDeEscala}>{note}</span>
            })}
          </div>
        </div>
      </div>
      <hr className={s.divisor}></hr>

      <h2 className={s.title}>Acordes:</h2>
      <div className={s.chordsWrapper}>
        <MyChord
          chord={chord}
          instrument={instrument}
          lite={lite}
          className={s.chord}
          />
      </div>
    </>
  )
}
NoteCalculator();
