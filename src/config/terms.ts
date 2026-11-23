/**
 * Terms Dictionary (§4 Config-first)
 * Allows customizable terminology per company.
 * Default terms are seeded from §6.
 */

export interface TermsDictionary {
  binder: string;
  binders: string;
  coldRoom: string;
  coldRooms: string;
  rack: string;
  racks: string;
  pallet: string;
  pallets: string;
  area: string;
  areas: string;
  filling: string;
  visualInspection: string;
  packing: string;
  holdTime: string;
  lot: string;
  batch: string;
  systemName: string;
  companyName: string;
  divisionName: string;
}

export const defaultTerms: TermsDictionary = {
  binder: "Binder",
  binders: "Binders",
  coldRoom: "Cold Room",
  coldRooms: "Cold Rooms",
  rack: "Rack",
  racks: "Racks",
  pallet: "Pallet",
  pallets: "Pallets",
  area: "Area",
  areas: "Areas",
  filling: "Filling",
  visualInspection: "Visual Inspection",
  packing: "Packing",
  holdTime: "Hold Time",
  lot: "Lot No.",
  batch: "Batch No.",
  systemName: "Product Tracking System (PTS)",
  companyName: "Company Pharmaceutical Limited",
  divisionName: "Biopharma Division",
};

let currentTerms: TermsDictionary = { ...defaultTerms };

export function getTerm(key: keyof TermsDictionary): string {
  return currentTerms[key] || defaultTerms[key] || String(key);
}

export function getAllTerms(): TermsDictionary {
  return { ...currentTerms };
}

type TermsListener = (terms: TermsDictionary) => void;
const listeners = new Set<TermsListener>();

export function subscribeTerms(listener: TermsListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setTerms(newTerms: Partial<TermsDictionary>): void {
  currentTerms = { ...currentTerms, ...newTerms };
  listeners.forEach((fn) => {
    try {
      fn({ ...currentTerms });
    } catch (e) {
      console.error("Error notifying terms listener:", e);
    }
  });
}

export function resetTerms(): void {
  currentTerms = { ...defaultTerms };
  listeners.forEach((fn) => {
    try {
      fn({ ...currentTerms });
    } catch (e) {
      console.error("Error notifying terms listener:", e);
    }
  });
}

