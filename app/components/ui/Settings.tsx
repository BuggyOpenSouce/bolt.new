import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { aiSettingsStore, updateAPIKey, updateAIProvider, type AIProvider } from '~/lib/stores/settings';
import { IconButton } from './IconButton';
import { classNames } from '~/utils/classNames';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AI_PROVIDERS = [
  {
    id: 'anthropic' as AIProvider,
    name: 'Anthropic Claude',
    models: [
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    ],
  },
  {
    id: 'gemini' as AIProvider,
    name: 'Google Gemini',
    models: [
      { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash' },
    ],
  },
  {
    id: 'openrouter' as AIProvider,
    name: 'OpenRouter',
    models: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'openai/gpt-4o', name: 'GPT-4o' },
      { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B' },
      { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5' },
    ],
  },
  {
    id: 'groq' as AIProvider,
    name: 'Groq',
    models: [
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    ],
  },
];

export function Settings({ isOpen, onClose }: SettingsProps) {
  const aiSettings = useStore(aiSettingsStore);
  const [activeTab, setActiveTab] = useState<'ai' | 'shortcuts'>('ai');

  if (!isOpen) return null;

  const currentProvider = AI_PROVIDERS.find(p => p.id === aiSettings.provider);

  return (
    <div className="fixed inset-0 z-max bg-black/50 flex items-center justify-center">
      <div className="bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-bolt-elements-borderColor">
          <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Settings</h2>
          <IconButton
            icon="i-ph:x"
            onClick={onClose}
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
          />
        </div>

        <div className="flex">
          <div className="w-48 border-r border-bolt-elements-borderColor">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('ai')}
                className={classNames(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  activeTab === 'ai'
                    ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                    : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive'
                )}
              >
                AI Provider
              </button>
              <button
                onClick={() => setActiveTab('shortcuts')}
                className={classNames(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  activeTab === 'shortcuts'
                    ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                    : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive'
                )}
              >
                Shortcuts
              </button>
            </nav>
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">AI Provider Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
                        Provider
                      </label>
                      <select
                        value={aiSettings.provider}
                        onChange={(e) => updateAIProvider(e.target.value as AIProvider)}
                        className="w-full px-3 py-2 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                      >
                        {AI_PROVIDERS.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
                        Model
                      </label>
                      <select
                        value={aiSettings.model}
                        onChange={(e) => updateAIProvider(aiSettings.provider, e.target.value)}
                        className="w-full px-3 py-2 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                      >
                        {currentProvider?.models.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
                        API Key for {currentProvider?.name}
                      </label>
                      <input
                        type="password"
                        value={aiSettings.apiKeys[aiSettings.provider]}
                        onChange={(e) => updateAPIKey(aiSettings.provider, e.target.value)}
                        placeholder={`Enter your ${currentProvider?.name} API key`}
                        className="w-full px-3 py-2 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                      />
                      <p className="mt-1 text-xs text-bolt-elements-textSecondary">
                        Your API key is stored locally and never sent to our servers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-bolt-elements-borderColor pt-6">
                  <h4 className="text-md font-medium text-bolt-elements-textPrimary mb-4">All API Keys</h4>
                  <div className="space-y-3">
                    {AI_PROVIDERS.map((provider) => (
                      <div key={provider.id}>
                        <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                          {provider.name}
                        </label>
                        <input
                          type="password"
                          value={aiSettings.apiKeys[provider.id]}
                          onChange={(e) => updateAPIKey(provider.id, e.target.value)}
                          placeholder={`${provider.name} API key`}
                          className="w-full px-3 py-2 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div>
                <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">Keyboard Shortcuts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-bolt-elements-textPrimary">Toggle Terminal</span>
                    <kbd className="px-2 py-1 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded text-sm text-bolt-elements-textSecondary">
                      Ctrl/Cmd + J
                    </kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}