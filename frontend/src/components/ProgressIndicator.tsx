'use client';

import { FiCheck } from 'react-icons/fi';

interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center" style={{ marginBottom: 'var(--space-6)', gap: 'var(--space-3)' }}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <div className="flex flex-col md:flex-row items-center" style={{ gap: 'var(--space-1)' }}>
              <div className={`rounded-full flex items-center justify-center transition-base ${
                isCompleted || isCurrent
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`} style={{ 
                width: '32px', 
                height: '32px',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-sm)'
              }}>
                {isCompleted ? <FiCheck size={14} /> : stepNumber}
              </div>
              <span className={`text-center transition-base ${
                isCompleted || isCurrent ? 'text-primary-600' : 'text-gray-600'
              }`} style={{ 
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-sm)'
              }}>
                {step}
              </span>
            </div>
            
            {stepNumber < steps.length && (
              <div className="bg-gray-200 flex-shrink-0" style={{ width: '48px', height: '2px' }}>
                <div 
                  className={`h-full transition-slow ${
                    stepNumber < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  style={{ width: stepNumber < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
