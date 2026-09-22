import Section from '../ui/Section.jsx'
import FormField from '../ui/FormField.jsx'
import AppButton from '../ui/AppButton.jsx'

export default function OrderFormPreview() {
  return (
    <Section id="order-form" title="Нове замовлення постачальнику">
      <FormField id="order-product" label="Товар">
        <input id="order-product" name="product" type="text" placeholder="Назва або штрихкод товару" />
      </FormField>

      <FormField id="order-quantity" label="Кількість до замовлення">
        <input id="order-quantity" name="quantity" type="number" min="1" defaultValue="10" />
      </FormField>

      <FormField id="order-supplier" label="Постачальник">
        <input id="order-supplier" name="supplier" type="text" placeholder="Назва постачальника" />
      </FormField>

      <FormField id="order-comment" label="Коментар">
        <textarea id="order-comment" name="comment" rows="3" placeholder="Необов'язковий коментар" />
      </FormField>

      <AppButton disabled>Оформити замовлення</AppButton>
    </Section>
  )
}