import React, { useState, useEffect } from "react";
import { Tonal, Note, Scale, Chord, Key, } from "@tonaljs/tonal";
import NoteCalculator from './NoteMethods'
import s from './ChordFunctions.module.scss'
import ChordRender from "../ChordRender/ChordRender";
import Select from "../UI/Select";
import MyChord from "../MyChord/MyChord";

export default function ChordFunctions() {
  console.log(s)

  /* Metodos  */
  const { freqToMidi, midi2Name, name2Midi, midi2Freq, setFrequency, setName } = window.Note().prototype

  const { notes: twelveNotes } = Scale.get("C chromatic")


  const [noteSelected, setNoteSelected] = useState("C")
  const [scaleSelected, setScaleSelected] = useState("major")
  const [instrumentSelected, setInstrumentSelected] = useState("guitar")

  const [isLoaded, setIsLoaded] = useState(false)


  const { notes, intervals, type } = Scale.get(`${noteSelected} ${scaleSelected}`)
  console.log(Scale.get(`${noteSelected} ${scaleSelected}`))

  const handleOnChange = (event) => {
    const { value } = event.target
    console.log(event.target.id)
    if (event.target.id === "scaleInput") {
      setScaleSelected(value)
    } else {
      setNoteSelected(value)
    }
  }

  const getChordsII = (noteSelected, scaleSelected) => {
    let escala;
    if (scaleSelected === 'minor') {
      escala = Key.minorKey((noteSelected))
      return escala.natural
    }
    if (scaleSelected === 'major') {
      escala = Key.majorKey((noteSelected))
    }
    return escala
  }
  const allChords = getChordsII(noteSelected, scaleSelected)


  useEffect(() => {
    setIsLoaded(true)
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    scales_chords_api_onload()
  }, [allChords])

  if (!isLoaded) return (<div><h1>Cargando...</h1></div>)
  return (
    <>

      <div className={s.tonalityWrapper}>
        <Select selectId="noteInput" label="Nota Base" options={twelveNotes} onChange={handleOnChange} />

        <Select selectId="scaleInput" label="Tonalidad" options={['major', 'minor']} onChange={handleOnChange} />

        <Select selectId="instrumentInput" label="Instrumento" options={['guitar', 'piano']} onChange={(event) => setInstrumentSelected(event.target.value)} />

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
      <MyChord />
      {/* <ul className={s.chords}>
        {allChords && allChords?.chords?.map((chord, idx) => {
          return (
            <li key={chord}>
              <div className={s.chordFunction}>
              {allChords.grades[idx]}
              <span className={s.sup}>{chord}</span>
              </div>
              <div className={s.chordsMedia}>
                <ins className="scales_chords_api" instrument={instrumentSelected} output="sound" chord={chord}></ins>
                <ins className="scales_chords_api" instrument={instrumentSelected} output="image" chord={chord}></ins>
              </div></li>
          )
        })}
      </ul> */}
    </>
  )
}
NoteCalculator();
