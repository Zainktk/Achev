import { WatchFields } from "./../types/InputForm";
import { useEffect, useState } from "react";
import { UseFormWatch } from "react-hook-form";

export const useWatchFields = (watch: UseFormWatch<WatchFields>) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const subscription = watch((_data: any) => {
      if (_data) {
        let data = _data;
        let isNickNameExist = false;
        Object.keys(data).forEach((key) => {
          if (key === "nickName") {
            isNickNameExist = true;
          }
        });
        if (isNickNameExist) {
          const { nickName, ...otherData } = _data; // Destructure nickName and get the rest of the fields
          data = otherData;
        }
        const keysLength = Object.values(data);
        const values = keysLength.map((item) => item).filter((item) => item);
        if (values.length === keysLength.length) {
          setIsDisabled(false);
        } else {
          setIsDisabled(true);
        }
      }
    });
    return () => subscription.unsubscribe();
    // }
  }, [watch]);

  return isDisabled;
};

// export default useWatchFields;

export const useCheckboxWatch = (watch: UseFormWatch<WatchFields>) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const subscription = watch((data) => {
      if (data) {
        const values = Object.values(data);
        const anyBoxChecked = values.some((value) => value);

        setIsDisabled(!anyBoxChecked);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return isDisabled;
};

// export default useCheckboxWatch;
