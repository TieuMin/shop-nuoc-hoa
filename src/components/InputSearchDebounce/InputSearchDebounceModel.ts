export interface InputSearchDebounceProps {
  fetchDataByKeyword: (searchText: string) => void;
  placeHolder?: string;
  keyParams: string;
  disabled?: boolean;
}
