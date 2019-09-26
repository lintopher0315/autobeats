import { INoteSequence, NoteSequence } from '../protobuf';
export declare class MidiConversionError extends Error {
    constructor(message?: string);
}
export declare function midiToSequenceProto(midi: string): NoteSequence;
export declare function sequenceProtoToMidi(ns: INoteSequence): Uint8Array;
export declare function urlToBlob(url: string): Promise<Blob>;
export declare function blobToNoteSequence(blob: Blob): Promise<NoteSequence>;
export declare function urlToNoteSequence(url: string): Promise<NoteSequence>;
