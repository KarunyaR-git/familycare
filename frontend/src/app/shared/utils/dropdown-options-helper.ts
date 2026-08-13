import { DropdownOption } from "../components/dropdown-component/dropdown-component";

export function mapDropdownOptions(list:any[]): DropdownOption[] {
    return  list.map((baby)=> {
      return {
        label: baby.name,
        value: baby.id
      }
    });
}