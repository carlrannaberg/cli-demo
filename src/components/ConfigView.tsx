import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useConfigStore } from '../stores/configStore.js';
import { useUIStore } from '../stores/uiStore.js';

interface ConfigSection {
  label: string;
  value: string;
  key: string;
  type: 'select' | 'toggle' | 'number';
  options?: Array<{ label: string; value: string | number | boolean }>;
}

export const ConfigView: React.FC = () => {
  const { config, updateConfig, saveConfig, resetToDefaults } = useConfigStore();
  const { showToast } = useUIStore();
  const [selectedSection, setSelectedSection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const sections: ConfigSection[] = [
    {
      label: 'Default View',
      value: config.defaultView,
      key: 'defaultView',
      type: 'select',
      options: [
        { label: 'Overview', value: 'overview' },
        { label: 'Issues', value: 'issues' },
        { label: 'Execution', value: 'execution' },
        { label: 'Logs', value: 'logs' }
      ]
    },
    {
      label: 'Color Theme',
      value: config.colorTheme,
      key: 'colorTheme',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' }
      ]
    },
    {
      label: 'Auto Commit',
      value: config.autoCommit ? 'Enabled' : 'Disabled',
      key: 'autoCommit',
      type: 'toggle'
    },
    {
      label: 'Provider',
      value: config.provider,
      key: 'provider',
      type: 'select',
      options: [
        { label: 'Anthropic', value: 'anthropic' },
        { label: 'OpenAI', value: 'openai' },
        { label: 'Custom', value: 'custom' }
      ]
    },
    {
      label: 'Output Buffer Size',
      value: config.outputBufferSize.toString(),
      key: 'outputBufferSize',
      type: 'number'
    },
    {
      label: 'Max Concurrent Executions',
      value: config.maxConcurrentExecutions.toString(),
      key: 'maxConcurrentExecutions',
      type: 'number'
    }
  ];

  const menuItems = [
    ...sections.map((section, index) => ({
      label: `${section.label}: ${section.value}`,
      value: `section-${index}`
    })),
    { label: '─'.repeat(40), value: 'divider' },
    { label: 'Save Changes', value: 'save' },
    { label: 'Reset to Defaults', value: 'reset' },
    { label: 'Back', value: 'back' }
  ];

  useInput((_input, key) => {
    if (key.escape) {
      if (unsavedChanges) {
        showToast('Unsaved changes discarded', 'warning');
      }
      setIsEditing(false);
    }
  });

  const handleSelect = async (item: { value: string }) => {
    if (item.value === 'divider') {return;}
    
    if (item.value === 'save') {
      try {
        await saveConfig();
        showToast('Configuration saved successfully', 'success');
        setUnsavedChanges(false);
      } catch {
        showToast('Failed to save configuration', 'error');
      }
    } else if (item.value === 'reset') {
      resetToDefaults();
      setUnsavedChanges(true);
      showToast('Configuration reset to defaults', 'info');
    } else if (item.value === 'back') {
      if (unsavedChanges) {
        showToast('Unsaved changes discarded', 'warning');
      }
      setIsEditing(false);
    } else if (item.value.startsWith('section-')) {
      const index = parseInt(item.value.split('-')[1]);
      const section = sections[index];
      
      if (section.type === 'toggle') {
        const currentValue = config[section.key as keyof typeof config] as boolean;
        updateConfig({ [section.key]: !currentValue });
        setUnsavedChanges(true);
      } else if (section.type === 'select' && section.options) {
        setIsEditing(true);
        setSelectedSection(index);
      }
    }
  };

  const handleOptionSelect = (item: { value: string | number | boolean }) => {
    const section = sections[selectedSection];
    updateConfig({ [section.key]: item.value });
    setUnsavedChanges(true);
    setIsEditing(false);
    showToast(`${section.label} updated`, 'info');
  };

  if (isEditing) {
    const section = sections[selectedSection];
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold>Select {section.label}:</Text>
        <Box marginTop={1}>
          <SelectInput
            items={section.options || []}
            onSelect={handleOptionSelect}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>(Press ESC to cancel)</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold>Configuration Settings</Text>
        {unsavedChanges && (
          <Text color="yellow"> (unsaved changes)</Text>
        )}
      </Box>
      
      <SelectInput
        items={menuItems}
        onSelect={handleSelect}
      />
      
      <Box marginTop={1}>
        <Text dimColor>
          Use arrow keys to navigate, Enter to select/toggle
        </Text>
      </Box>
    </Box>
  );
};