import { atom, map } from 'nanostores';
import { workbenchStore } from './workbench';
import type { AIProvider } from '~/lib/.server/llm/model';

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  ctrlOrMetaKey?: boolean;
  action: () => void;
}

export interface Shortcuts {
  toggleTerminal: Shortcut;
}

export interface APIKeys {
  anthropic: string;
  gemini: string;
  openrouter: string;
  groq: string;
}

export interface AISettings {
  provider: AIProvider;
  model: string;
  apiKeys: APIKeys;
}

export interface Settings {
  shortcuts: Shortcuts;
  ai: AISettings;
}

const persistenceEnabled = !import.meta.env.VITE_DISABLE_PERSISTENCE;

// Load settings from localStorage
function loadSettings(): Settings {
  if (!persistenceEnabled || typeof localStorage === 'undefined') {
    return getDefaultSettings();
  }

  try {
    const stored = localStorage.getItem('bolt_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...getDefaultSettings(), ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }

  return getDefaultSettings();
}

function getDefaultSettings(): Settings {
  return {
    shortcuts: {
      toggleTerminal: {
        key: 'j',
        ctrlOrMetaKey: true,
        action: () => workbenchStore.toggleTerminal(),
      },
    },
    ai: {
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20240620',
      apiKeys: {
        anthropic: '',
        gemini: '',
        openrouter: '',
        groq: '',
      },
    },
  };
}

export const shortcutsStore = map<Shortcuts>(loadSettings().shortcuts);

export const aiSettingsStore = map<AISettings>(loadSettings().ai);

export const settingsStore = map<Settings>({
  shortcuts: shortcutsStore.get(),
  ai: aiSettingsStore.get(),
});

// Save settings to localStorage when they change
function saveSettings() {
  if (!persistenceEnabled || typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('bolt_settings', JSON.stringify(settingsStore.get()));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

shortcutsStore.subscribe((shortcuts) => {
  settingsStore.setKey('shortcuts', shortcuts);
  saveSettings();
});

aiSettingsStore.subscribe((aiSettings) => {
  settingsStore.setKey('ai', aiSettings);
  saveSettings();
});

export function updateAISettings(updates: Partial<AISettings>) {
  const current = aiSettingsStore.get();
  aiSettingsStore.set({ ...current, ...updates });
}

export function updateAPIKey(provider: AIProvider, apiKey: string) {
  const current = aiSettingsStore.get();
  aiSettingsStore.set({
    ...current,
    apiKeys: {
      ...current.apiKeys,
      [provider]: apiKey,
    },
  });
}

export function updateAIProvider(provider: AIProvider, model?: string) {
  const current = aiSettingsStore.get();
  const updates: Partial<AISettings> = { provider };
  
  if (model) {
    updates.model = model;
  } else {
    // Set default model for provider
    switch (provider) {
      case 'anthropic':
        updates.model = 'claude-3-5-sonnet-20240620';
        break;
      case 'gemini':
        updates.model = 'gemini-1.5-pro-latest';
        break;
      case 'openrouter':
        updates.model = 'anthropic/claude-3.5-sonnet';
        break;
      case 'groq':
        updates.model = 'llama-3.1-70b-versatile';
        break;
    }
  }
  
  aiSettingsStore.set({ ...current, ...updates });
}