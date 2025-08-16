import { Input } from "antd";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { InputSearchDebounceProps } from "./InputSearchDebounceModel";

const InputSearchDebounce: React.FC<InputSearchDebounceProps> = ({
  fetchDataByKeyword,
  placeHolder,
  keyParams,
  disabled,
}) => {
  const [keyword, setKeyword] = useState("");
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (keyParams) {
      setKeyword(keyParams);
      fetchDataByKeyword(keyParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyParams]);

  const onChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setKeyword(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchDataByKeyword(value);
    }, 600);
  };

  return (
    <Input
      className="w-full h-8"
      value={keyword}
      placeholder={placeHolder}
      onChange={onChangeKeyword}
      disabled={disabled}
    />
  );
};

export default InputSearchDebounce;
