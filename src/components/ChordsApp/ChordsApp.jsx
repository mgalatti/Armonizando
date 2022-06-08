import React, { useState, useEffect, useCallback } from "react";
import { Tonal, Note, Scale, Key, } from "@tonaljs/tonal";
import NoteCalculator from './NoteMethods'
import s from './ChordsApp.module.scss'
import Select from "../UI/Select";
import MyChord from "../MyChord";
import chordsDB from '../../chords-db-master/lib/guitar.json';

export default function ChordsApp() {

  const majorKeyTemplate = ['major', 'minor', 'minor', 'major', '7', 'minor', 'dim']
  const minorKeyTemplate = ['minor', 'dim', 'major', 'minor', 'minor', 'major', '7']


  /* Metodos  */
  // const { freqToMidi, midi2Name, name2Midi, midi2Freq, setFrequency, setName } = window.Note().prototype

  const twelveNotes = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']


  const [noteSelected, setNoteSelected] = useState("C")
  const [scaleSelected, setScaleSelected] = useState("major")
  const [instrumentSelected, setInstrumentSelected] = useState("guitar")
  const [positionSelected, setPositionSelected] = useState(0)
  const [chordsCalculated, setChordsCalculated] = useState([])

  const { notes, intervals, type } = Scale.get(`${noteSelected} ${scaleSelected}`)
  const sanitizeSharps = {
    "D#":"Eb",
    "G#":"Ab",
    "E#":"F",
    "A#":"Bb",
    "B#":"C",
    "Db":"C#",
 };
  const sanitizedNotes = []
  const re = new RegExp(Object.keys(sanitizeSharps).join("|"),"gi"); 

  notes.forEach((note) => {
    const noteArray = note.replace(re, (matched) => sanitizeSharps[matched]);
    sanitizedNotes.push(noteArray)
  })
 
 
  const handleOnChange = (event) => {
    const { value } = event.target
    if (event.target.id === "scaleInput") {
      setScaleSelected(value)
    }
    if (event.target.id === 'noteInput') {
      setNoteSelected(value)
    }
    if (event.target.id === 'positionInput') {
      setPositionSelected(value)
    }
  }

  function buildKeyChords(notes, scaleSelected) {
    let keyChords = []
    if (scaleSelected === 'major') {
      const template = majorKeyTemplate;
      let suffix;
      template.forEach((element, idx) => {
        suffix = chordsDB?.suffixes?.find((el) => el === template[idx])
        const note = chordsDB?.chords[notes[idx]]
        const filteredNotes = note?.find((el) => el.suffix === suffix)
        keyChords.push(filteredNotes)
      })
    }
    if (scaleSelected === 'minor') {
      const template = minorKeyTemplate;
      let suffix;
      template.forEach((element, idx) => {
        suffix = chordsDB?.suffixes?.find((el) => el === template[idx])
        const note = chordsDB?.chords[notes[idx]]
        const filteredNotes = note?.find((el) => el.suffix === suffix)
        keyChords.push(filteredNotes)
      })
    }
    return keyChords
  }

  useEffect(() => {
    const chords = buildKeyChords(sanitizedNotes, scaleSelected)
    setChordsCalculated(chords)
  }, [noteSelected, scaleSelected])


  // const chord = chordsDB.chords[noteSelected][0].positions[positionSelected];

  const instrument = {
    strings: 6,
    fretsOnChord: 4,
    name: 'Guitar',
    keys: [],
    tunings: {
      standard: ['E', 'A', 'D', 'G', 'B', 'E']
    }
  }

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
      <Select options={[0, 1, 2, 3]} label="Posicion" selectId="positionInput" onChange={handleOnChange} className={s.positionSelect} />
      <div className={s.chordsWrapper}>
        {chordsCalculated?.map((element, idx) => {
          return (
            <div className={s.chord} key={`chordCalculated-${idx}`}>
              <MyChord
                chord={element?.positions[positionSelected]}
                instrument={instrument}
              />
            </div>
          )
        })}

      </div>
    </>
  )
}
NoteCalculator();
