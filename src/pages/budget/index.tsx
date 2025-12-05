import { BudgetGrid } from './components/BudgetGrid'
import './budget.scss'

const BudgetPage = () => {
  return (
    <div className="budget-page">
      <div className="budget-container">
        <div className="budget-header">
          <div>
            <h1 className="budget-title">Бюджет</h1>
            <p className="budget-subtitle">Управление вашим бюджетом</p>
          </div>
        </div>
        <div className="budget-grid-wrapper">
          <BudgetGrid />
        </div>
      </div>
    </div>
  )
}

export default BudgetPage

