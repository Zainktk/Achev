import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ProgramsHeader from "../../components/ProgramsHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgramScreenFlowType } from "src/navigation/dashboard/ProgramNavigator";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { Buttonn, OutlinedButton } from "@atoms";

const ApplyForProgram = () => {
  const theme = useTheme();
  const ProgramStack =
    useNavigation<NativeStackNavigationProp<ProgramScreenFlowType>>();
  const onBack = () => {
    ProgramStack.navigate("program");
  };

  const onApply = () => {
    ProgramStack.navigate("eligibility");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <ProgramsHeader prop={"Select"} Screen={"program"} onBack={onBack} />
      </View>
      <ScrollView style={{ marginHorizontal: 22, marginTop: 20 }}>
        <Text
          style={{
            color: "rgba(224, 79, 57, 1)",
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 20,
            fontWeight: "600",
            lineHeight: 25,
          }}
        >
          Expand your professional network and enhance your employability by
          connecting with a mentor.
        </Text>
        <Text
          style={{
            marginTop: 20,
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 16,
            fontWeight: "800",
            color: "rgba(0, 0, 0, 1)",
          }}
        >
          Connect with a mentor to launch your career.
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.labelLarge.fontFamily,
            color: "rgba(0, 0, 0, 1)",
            fontSize: 16,
            fontWeight: "400",
            marginTop: 10,
          }}
        >
          netWORKS is a new way for young professionals to make connections with
          mentors who can help them get their careers off the ground through
          career-oriented networking and mentoring opportunities.
        </Text>
        <Text
          style={{
            marginTop: 20,
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 16,
            fontWeight: "800",
            color: "rgba(0, 0, 0, 1)",
          }}
        >
          Here’s how it works:
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.labelLarge.fontFamily,
            color: "rgba(0, 0, 0, 1)",
            fontSize: 16,
            fontWeight: "400",
            marginTop: 10,
          }}
        >
          Mentors and the young professionals (mentees) receive training and
          then are able to participate in large group (speed networking), small
          group and individual networking sessions.
        </Text>
        <Text
          style={{
            marginTop: 20,
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 16,
            fontWeight: "800",
            color: "rgba(0, 0, 0, 1)",
          }}
        >
          Program features:
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.labelLarge.fontFamily,
            color: "rgba(0, 0, 0, 1)",
            fontSize: 16,
            fontWeight: "400",
            marginTop: 10,
          }}
        >
          {`\u2022   Meet new career role models `}
          {`\n`}
          {`\u2022 Expand your professional network`} {`\n`}
          {`\u2022 Build your confidence `} {`\n`}{" "}
          {`\u2022 Get real-world advice about how to find a  job`}
          {`\n`}
          {`\u2022 Access information about the corporate work environment`}
          {`\n`}
          {`\u2022    Get constructive feedback about your career ideas and job search`}
        </Text>
      </ScrollView>
      <View style={[styles.bottomView]}>
        <OutlinedButton
          title={"Cancel"}
          ButtonStyle={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            width: 150,
            borderColor: "rgba(119, 110, 100, 1)",
          }}
        />
        <Buttonn
          title={"Select"}
          ButtonStyle={{ width: 150 }}
          onPress={onApply}
        />
      </View>
    </SafeAreaView>
  );
};

export default ApplyForProgram;

const styles = StyleSheet.create({
  bottomView: {
    height: 90,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    shadowOpacity: 1,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    flexDirection: "row",
    gap: 40,
  },
});
