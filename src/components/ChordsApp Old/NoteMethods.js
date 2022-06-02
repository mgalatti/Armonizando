export default window.Note = (function() {

    const noteNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    const constiantNames = [null,"Db",null,"Eb",null,null,"Gb",null,"Ab",null,"Bb",null];

    const Note = function (note) {

        this.baseNote = 440;
        this.octaveMiddleC = 4;
        this.lastOctave = 4;
        this.lastPitch = -1;
        this.name = "A4";
        this.frequency = 440;
        this.midi = 69;

        if (note) {
            if (note.frequency) {
                this.setFrequency(note.frequency);
                return;
            }
            if (note.midi) {
                this.setMIDI(note.midi);
                return;
            }
            if (note.name) {
                this.setName(note.name);
                return;
            }
        }
    }

    Note.prototype.setFrequency = function (freq) {
        this.frequency = freq;
        this.midi = this._calculateFreq2Midi(freq);
        this.name = this._calculateMidi2Name(this.midi);
    }

    Note.prototype.setMIDI = function (noteNum) {
        this.midi = noteNum;
        this.name = this._calculateMidi2Name(noteNum);
        this.frequency = this._calculateMidi2Freq(noteNum);
    }

    Note.prototype.setName = function (name) {
        this.midi = this._calculateName2Midi(name);
        this.name = this._calculateMidi2Name(this.midi);
        this.frequency = this._calculateMidi2Freq(this.midi);
    }

    Note.prototype.freqToMidi = function (freq, baseNote) {
        const bs = baseNote || 440.0;
        return Math.round((12 * (Math.log(freq / (bs / 2)) / Math.log(2))) + 57);
    }

    Note.prototype._calculateFreq2Midi = function (freq) {
        return this.freqToMidi (freq, this.baseNote);
    }

    Note.prototype.midi2Freq = function (noteNum, baseNote) {
        const bs = baseNote || 440;
        return bs * Math.pow(2, (noteNum - 69) / 12);
    }

    Note.prototype._calculateMidi2Freq = function (noteNum) {
        return this.midi2Freq(noteNum, this.baseNote);
    }

    Note.prototype.midi2Name = function (noteNum, lastPitch, lastOctave, octaveMiddleC) {

        const lp = lastPitch || -1;
        const lo = lastOctave || 4;
        const omc = octaveMiddleC || 4;

        let	octaveAdjust = 0;
        while (noteNum < 0) {
            noteNum += 12;
            octaveAdjust -= 1;
        }
        const	pitch = noteNum % 12;
        const octave = (Math.floor(noteNum / 12) - (5 - omc)) + octaveAdjust;
        let noteName = noteNames[pitch] + octave.toString();
        if (constiantNames[pitch] != null) {
            noteName += "/" + constiantNames[pitch] + octave.toString();
        }

        return {name: noteName, pitch: pitch, octave: octave };
    }

    Note.prototype._calculateMidi2Name = function (noteNum) {

        const res = this.midi2Name(noteNum, this.lastPitch, this.lastOctave, this.octaveMiddleC);

        this.lastPitch = res.pitch;
        this.lastOctave = res.octave;

        return res.name;

    }

    Note.prototype.name2Midi = function (noteName, lastOctave, lastPitch, octaveMiddleC) {

        const lo = lastOctave || 4;
        const lp = lastPitch || -1;
        const omc = octaveMiddleC || 4;

        let	octave = lo;

        const	octaveIndex = noteName.search(/[-+]*\d+/);
        if (octaveIndex !== -1) {
            const	octaveStr = noteName.substring(octaveIndex);
            octave = parseInt(octaveStr);
            if (isNaN(octave) || (octave < -4) || (octave > 11)) {
                octave = lo;
            }
        }

        let	noteStr = noteName.charAt(0).toUpperCase();
        const	noteconstiant = noteName.charAt(1);
        if ((noteconstiant === "b") || (noteconstiant === "#")) {
            noteStr += noteconstiant;
        }

        let pitchMatch = null;
        let	pitchNum = -1;
        for (const i=11; i>=0; i--) {
            if ((constiantNames[i] != null) && (noteStr.indexOf(constiantNames[i]) == 0)) {
                pitchNum = i;
                pitchMatch = constiantNames[i];
                break;
            }
        }
        if (pitchNum < 0) {
            for (let i=11; i>=0; i--) {
                if (noteStr.indexOf(noteNames[i]) == 0) {
                    pitchNum = i;
                    pitchMatch = noteNames[i];
                    break;
                }
            }
        }
        let midi;
        if (pitchNum < 0) {
            pitchNum = lp;
        }
        if (pitchNum < 0) {
            // Still an invalid note? Use default
            midi = 69;

        }
        else {
            midi = Math.round(pitchNum + ((octave + (5 - omc)) * 12));
        }

        return midi;
    };

    Note.prototype._calculateName2Midi = function (noteName) {
        return this.name2Midi (noteName, this.lastOctave, this.lastPitch, this.octaveMiddleC);
    };

    return Note;

});