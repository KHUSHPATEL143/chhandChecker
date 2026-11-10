export interface SavedGhazal {
  id: string;
  title: string;
  text: string;
  baharTitle: string;
  baharPattern: string;
  category: 'શ્રૃંગાર' | 'દર્શન' | 'સૂફી' | 'કરુણ' | 'અન્ય';
  updatedAt: string;
  isPerfect: boolean;
}

const STORAGE_KEY = 'gujarati_ghazal_notebook_v1';

export function getSavedGhazals(): SavedGhazal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveGhazalToNotebook(
  item: Omit<SavedGhazal, 'id' | 'updatedAt'>,
  existingId?: string
): SavedGhazal {
  const current = getSavedGhazals();
  const id = existingId || `ghazal_${Date.now()}`;
  const updatedAt = new Date().toISOString();

  const newEntry: SavedGhazal = {
    ...item,
    id,
    updatedAt,
  };

  const index = current.findIndex((g) => g.id === id);
  let updatedList: SavedGhazal[];

  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = newEntry;
  } else {
    updatedList = [newEntry, ...current];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return newEntry;
}

export function deleteGhazalFromNotebook(id: string): void {
  const current = getSavedGhazals();
  const updated = current.filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function exportNotebookAsText(): string {
  const list = getSavedGhazals();
  let text = `📖 મારો ગઝલ સંગ્રહ (દિવાન)\nતારીખ: ${new Date().toLocaleDateString('gu-IN')}\n`;
  text += `==============================================\n\n`;

  list.forEach((g, idx) => {
    text += `[${idx + 1}] ${g.title} (${g.category})\n`;
    text += `છંદ: ${g.baharTitle}\n`;
    text += `----------------------------------------------\n`;
    text += `${g.text}\n\n`;
  });

  return text;
}