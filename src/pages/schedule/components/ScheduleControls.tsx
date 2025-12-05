import type { GetAllSportComplexesForAdminQuery } from '@/graphql/generated'
import { DatePicker, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

type SportComplex = NonNullable<GetAllSportComplexesForAdminQuery['sportComplexes_Get']>[0]

interface ScheduleControlsProps {
    selectedComplexId: string | null
    selectedDate: Dayjs | null
    availableComplexes: SportComplex[]
    complexesLoading: boolean
    onComplexChange: (complexId: string) => void
    onDateChange: (date: Dayjs | null) => void
}

const COMMON_STYLES = {
    height: 20,
    minHeight: 20,
    fontSize: 9
}

const COMMON_CLASSES = 'w-full !h-5 !min-h-5 !text-[9px]'

export function ScheduleControls({
    selectedComplexId,
    selectedDate,
    availableComplexes,
    complexesLoading,
    onComplexChange,
    onDateChange
}: ScheduleControlsProps) {
    const sortedComplexes =
        availableComplexes
            ?.sort((a, b) => a.title.localeCompare(b.title))
            .map(complex => ({
                label: complex.title,
                value: complex.id
            })) || []

    return (
        <div className="schedule-controls flex flex-wrap items-center gap-4 py-0  shrink-0">
            <div className="w-full sm:w-auto sm:min-w-[300px]">
                <Select
                    showSearch
                    placeholder="Выберите спорткомплекс..."
                    value={selectedComplexId}
                    onChange={onComplexChange}
                    loading={complexesLoading}
                    options={sortedComplexes}
                    className={COMMON_CLASSES}
                    variant="filled"
                    size="small"
                    filterOption={(input, option) =>
                        option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false
                    }
                    styles={{
                        popup: { root: { fontSize: 9 } }
                    }}
                />
            </div>
            <div className="w-full sm:w-auto">
                <DatePicker
                    value={selectedDate}
                    onChange={onDateChange}
                    format="DD.MM.YYYY"
                    className={COMMON_CLASSES}
                    allowClear={false}
                    variant="filled"
                    size="small"
                    placeholder="Выберите дату"
                    style={COMMON_STYLES}
                    disabledDate={current => current && current < dayjs().startOf('day')}
                />
            </div>
        </div>
    )
}
