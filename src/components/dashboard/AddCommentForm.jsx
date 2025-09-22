import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AddCommentForm({ value, onChange, onSubmit }) {
  return (
    <div className="flex mt-2 gap-2">
      <Input placeholder="Add a comment..." value={value} onChange={(e) => onChange(e.target.value)} />
      <Button onClick={onSubmit}>Comment</Button>
    </div>
  )
}
