import { useForm } from 'react-hook-form'

interface Props {
  defaultValues?: {
    firstName?: string
    lastName?: string
    fullName?: string
  }
}

export default function QuestionForm({ defaultValues }: Props) {
  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      firstName: defaultValues?.firstName || '',
      lastName: defaultValues?.lastName || '',
      fullName: defaultValues?.fullName || '',
      // ... other form fields
    }
  })

  // ... rest of the component code
} 