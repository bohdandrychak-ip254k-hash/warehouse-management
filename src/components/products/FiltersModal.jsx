import Modal from '../ui/Modal.jsx'
import AppButton from '../ui/AppButton.jsx'

export default function FiltersModal({
  sections,
  categories,
  selectedSectionIds,
  selectedCategoryIds,
  onToggleSection,
  onToggleCategory,
  onClose,
}) {
  return (
    <Modal title="Фільтри каталогу" onClose={onClose}>
      <fieldset className="filter-group">
        <legend>Секції</legend>
        <div className="filter-options">
          {sections.map((section) => (
            <label key={section.id} className="filter-chip">
              <input
                type="checkbox"
                checked={selectedSectionIds.has(section.id)}
                onChange={() => onToggleSection(section.id)}
              />
              {section.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Категорії</legend>
        <div className="filter-options">
          {categories.map((category) => (
            <label key={category.id} className="filter-chip">
              <input
                type="checkbox"
                checked={selectedCategoryIds.has(category.id)}
                onChange={() => onToggleCategory(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>

      <AppButton onClick={onClose}>Готово</AppButton>
    </Modal>
  )
}