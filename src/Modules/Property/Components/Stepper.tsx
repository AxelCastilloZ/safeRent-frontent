type StepperProps = {
  steps: string[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep

        return (
          <div key={label} className="flex items-center gap-1.5">
            {i > 0 && <div className={`h-px w-6 ${isCompleted ? 'bg-secondary' : 'bg-slate-200'}`} />}
            <span
              className={`grid size-7 place-items-center rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-primary text-white'
                  : isCompleted
                    ? 'bg-secondary text-white'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {stepNum}
            </span>
            <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
