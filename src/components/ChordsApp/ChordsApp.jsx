import React, { useState, useEffect } from "react";
import { Tonal, Note, Scale, Key, } from "@tonaljs/tonal";
import NoteCalculator from './NoteMethods'
import s from './ChordsApp.module.scss'
import Select from "../UI/Select";
import MyChord from "../MyChord";
import chordsDB from '../../chords-db-master/lib/guitar.json';
import { indexOf } from "lodash";

export default function ChordsApp() {
  /* Metodos  */
  // const oscillator = audioContext.createOscillator();
  // oscillator.type = 'sine';

  let audioContext;

  const handlePlay = () => {
    const chords = getFreqs()
    audioContext = new AudioContext();
    audioContext.resume()
    // C4, E4, G4
    let freqs = [chords[0].freq[1], chords[0].freq[2] * 2, chords[0].freq[3] * 2, chords[0].freq[4] * 2, chords[0].freq[5] * 2];
    for (let i = 0; i < freqs.length; i++) {
      var o = audioContext.createOscillator();
      var g = audioContext.createGain();
      o.frequency.value = freqs[i];
      o.connect(g);
      g.gain.value = 1 / freqs.length;
      g.connect(audioContext.destination);
      o.start(0);
      setTimeout(function (s) { s.stop(0) }, 2000, o);
    }
  }

  const handleStop = () => {
    audioContext.close()
  }

  const majorKeyTemplate = ['major', 'minor', 'minor', 'major', '7', 'minor', 'dim']
  const minorKeyTemplate = ['minor', 'dim', 'major', 'minor', 'minor', 'major', '7']


  /* Metodos  */
  const { freqToMidi, midi2Name, name2Midi, midi2Freq, setFrequency, setName } = window.Note().prototype

  const twelveNotes = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']


  const [noteSelected, setNoteSelected] = useState("C")

  const [scaleSelected, setScaleSelected] = useState("major")

  const initialValues = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}

  const [positionSelected, setPositionSelected] = useState(initialValues)

  const [chordsCalculated, setChordsCalculated] = useState([])

  const structuredChords = () => {
    // midi2Freq()
    let allChords = [];
    chordsCalculated.forEach((chord, idx) => {
      let chords = {}
      chords.name = (chord.key + chord.suffix)
      chords.midi = chord.positions[positionSelected].midi
      chords.freq = []
      allChords.push(chords)
    })
    return allChords
  }

  const getFreqs = () => {
    const chords = structuredChords();
    chords.forEach((chord, idx) => {
      let midis = []
      chord.midi.forEach((midi) => {
        midis.push(midi)
      })
      midis.forEach((midiNote) => {
        chord.freq.push(midi2Freq(midiNote))
      })
    })
    return chords
  }

  const { notes, intervals, type } = Scale.get(`${noteSelected} ${scaleSelected}`)
  const sanitizeSharps = {
    "D#": "Eb",
    "G#": "Ab",
    "E#": "F",
    "A#": "Bb",
    "B#": "C",
    "Db": "C#",
  };
  const sanitizedNotes = []
  const re = new RegExp(Object.keys(sanitizeSharps).join("|"), "gi");

  notes.forEach((note) => {
    const noteArray = note.replace(re, (matched) => sanitizeSharps[matched]);
    sanitizedNotes.push(noteArray)
  })


  const handleOnChange = (event) => {
    event.preventDefault();
    const { value, dataset } = event.target
    if (event.target.id === "scaleInput") {
      setScaleSelected(value)
    }
    if (event.target.id === 'noteInput') {
      setNoteSelected(value)
    }
    if (event.target.id === 'positionInput') {
      setPositionSelected({
        ...positionSelected,
        [dataset.chord]:value,
      })
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
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>

      <div className={s.chordsWrapper}>
        {chordsCalculated?.map((chord, idx) => {
          const chordName = chord.key
          const position = positionSelected[idx]
          return (
            <>
              <div className={s.chord} key={`chordCalculated-${idx}`}>
                <h3 className={s.chordName}>{chordName + chord.suffix}</h3>
                <Select options={[0, 1, 2, 3]} name={chordName} data-chord={idx} label="Posicion" selectId="positionInput" onChange={handleOnChange} className={s.positionSelect} />
                <MyChord
                  chord={chord?.positions[position]}
                  instrument={instrument} />
              </div>
            </>
          )
        })}

      </div>
    </>
  )
}
NoteCalculator();
