import { Popover } from 'antd'
import { Info } from 'lucide-react'
import type { FormFieldReference } from '../../types'
import styles from './message-sources.module.scss'

interface MessageSourcesProps {
  selectedFields: FormFieldReference[]
}

export const MessageSources: React.FC<MessageSourcesProps> = ({ selectedFields }) => {
  if (!selectedFields || selectedFields.length === 0) {
    return null
  }

  // Фильтруем только валидные поля с полной иерархией
  const validFields = selectedFields.filter(
    (field) => field?.name && field?.parentForm?.name && field?.parentForm?.parentPlaceType?.name
  )

  if (validFields.length === 0) {
    return null
  }

  const content = (
    <div className={styles.popoverContent}>
      <div className={styles.title}>Источники информации:</div>
      <div className={styles.sourcesList}>
        {validFields.map((field) => (
          <div key={field.id} className={styles.sourceItem}>
            <div className={styles.fieldName}>{field.name}</div>
            <div className={styles.fieldPath}>
              <span className={styles.placeType}>{field.parentForm.parentPlaceType.name}</span>
              <span className={styles.separator}>→</span>
              <span className={styles.form}>{field.parentForm.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Popover 
      content={content} 
      trigger="hover" 
      placement="top"
      overlayClassName={styles.popoverOverlay}
      arrow={{ pointAtCenter: true }}
    >
      <div className={styles.infoIcon}>
        <Info size={14} />
      </div>
    </Popover>
  )
}

