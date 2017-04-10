export class SearchFilter {
  id:          number;
  text:        string;
  isSelected:  boolean;
  value:       number;
  name:        string;

  constructor(name: string, record?: any, value?: number ) {
    this.name = name;
    this.id = record ? record.id: null;
    this.text = record ? record.text: null;
    this.isSelected = record ? record.isSelected: null;
    this.value = value ? value: null;
  }
}
