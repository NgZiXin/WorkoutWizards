import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  SectionList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import sampleData from "./data";
import tableStyles from "@/styles/table";
import { globalStyles } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import ValidationModal from "@/components/modal/workoutPage/muscleGroup/validation";

type TableData = {
  name: string;
  weight: number;
  amount: string;
};

export default function Table() {
  // returns a memoized array value, that never changes
  // so don't need to keep rebuilding on every render
  const columns = useMemo(() => ["Name", "Weight", "Amount"], []);

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [validationModal, setValidationModal] = useState<boolean>(false);
  const deleteIndex = useRef<number>(-1);

  // on mount, setTableData based on the sampleData (placeholder for now)
  useEffect(() => {
    setTableData(sampleData);
  }, []);

  // returns a memoized function object, that never changes
  // so don't need to keep rebuilding on every render
  const renderHeader = useCallback(
    (columns: string[]) => (
      <View style={{ flexDirection: "row" }}>
        {columns.map((column: string, index: number) => (
          <View
            key={index}
            style={
              index === 0 ? tableStyles.nameHeader : tableStyles.otherHeader
            }
          >
            <Text
              style={[
                styles.headerLabel,
                index === 2 ? styles.extra : undefined,
              ]}
            >
              {column + " "}
            </Text>
          </View>
        ))}
      </View>
    ),
    []
  );

  // same idea
  const renderRows = useCallback(
    ({ item, index }: any) => {
      return (
        <View style={tableStyles.rowContainer}>
          <View style={tableStyles.firstCellWrapper}>
            <TouchableOpacity
              style={{ width: "10%" }}
              onPress={() => handlePress(index)}
            >
              <Ionicons
                name="close-outline"
                size={15}
                style={{ position: "relative", right: 5 }}
              />
            </TouchableOpacity>
            <Text style={globalStyles.label}>{item.name}</Text>
          </View>

          <View style={tableStyles.otherCellWrapper}>
            <Text style={globalStyles.label}>{item.weight}</Text>
          </View>

          <View style={tableStyles.otherCellWrapper}>
            <Text style={globalStyles.label}>{item.amount}</Text>
          </View>
        </View>
      );
    },
    [tableData]
  );

  // no need to over-optimize for these two functions
  function handlePress(index: number) {
    deleteIndex.current = index;
    setValidationModal(true);
  }

  function handleDelete() {
    setTableData((prevTableData) =>
      prevTableData.filter((_, i) => i !== deleteIndex.current)
    );
  }

  return (
    <View style={{ height: 281, marginTop: -19 }}>
      <FlatList
        data={tableData}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader(columns)}
        renderItem={renderRows}
      />

      {validationModal && (
        <ValidationModal
          setValidationModal={setValidationModal}
          topText="Delete Confirmation"
          bottomText="Are you sure you want to delete this exercise"
          handleDelete={handleDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerLabel: {
    ...globalStyles.label,
    fontFamily: "inter-semibold",
  },

  extra: {
    position: "relative",
    left: 2.5,
  },
});
