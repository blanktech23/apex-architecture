import { PlanRenderer } from '@/components/PlanRenderer';
import fs from 'fs';
import path from 'path';

export default function PlanPage() {
  const html = fs.readFileSync(
    path.join(process.cwd(), 'src/content/plan/body.html'),
    'utf-8'
  );

  return <PlanRenderer html={html} />;
}
