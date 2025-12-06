import { Tag } from 'antd'
import type { FormFieldReference } from '../../types'
import styles from './field-suggests.module.scss'

interface FieldSuggestsProps {
  proposedFields: FormFieldReference[]
  onSelectField: (field: FormFieldReference) => void
}

export const FieldSuggests: React.FC<FieldSuggestsProps> = ({ proposedFields, onSelectField }) => {
  if (!proposedFields || proposedFields.length === 0) {
    return null
  }


  return (
    <div className={styles.container}>
      <div className={styles.label}>Выберите поля для поиска:</div>
      <div className={styles.suggests}>
        {proposedFields.map(field => (
          <Tag key={field.id} className={styles.suggest} onClick={() => onSelectField(field)}>
            <div className={styles.fieldName}>{field?.name || 'Неизвестно'}</div>
            <div className={styles.fieldPath}>
              {field?.parentForm?.parentPlaceType ? (
                <>
                  {field?.parentForm?.parentPlaceType?.name || 'Неизвестно'} →{' '}
                  {field?.parentForm?.name || 'Неизвестно'}
                </>
              ) : (
                <>{field?.parentForm?.name || 'Неизвестно'}</>
              )}
            </div>
          </Tag>
        ))}
      </div>
    </div>
  )
}
