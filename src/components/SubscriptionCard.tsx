import { SubscriptionCardFlower, Tick } from "@utils";
import { Dimensions, StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { OutlinedButton } from "./atoms/AppButtons";
import { ScreenText } from "./atoms/Typography";

type Props = {
  subscriptionCatogary: string;
};

const SubscriptionCard = ({ subscriptionCatogary }: Props) => {
  const height = Dimensions.get("window").height;
  const CardBackgroundColorMapping: { [key: string]: string } = {
    diamond: "rgba(182, 177, 197, 1)",
    gold: "rgba(196, 221, 207, 1)",
  };
  const CardTextColorMapping: { [key: string]: string } = {
    gold: "rgba(60, 110, 82, 1)",
    diamond: " rgba(110, 99, 138, 1)",
  };
  // const dividerColor: { [key: string]: string } = {
  //   gold: "rgba(137, 187, 159, 1)",
  //   diamond: "rgba(110, 99, 138, 1)",
  // };

  const theme = useTheme();
  return (
    <View
      style={{
        ...styles.SubscriptionContainer,
        backgroundColor: CardBackgroundColorMapping[subscriptionCatogary],
        flex: height < 700 ? 1 : 0.95,
        position: "relative",
      }}
    >
      <View style={styles.priceContainer}>
        <ScreenText
          color={CardTextColorMapping[subscriptionCatogary]}
          label={"$114/mo"}
        />
        <ScreenText
          label={subscriptionCatogary}
          color={CardTextColorMapping[subscriptionCatogary]}
          styles={{
            fontSize: 15,
            textTransform: "capitalize",
            fontFamily: theme?.fonts?.headlineMedium?.fontFamily,
          }}
        />
      </View>
      <Divider
        style={{
          backgroundColor: CardTextColorMapping[subscriptionCatogary],
          borderWidth: 0.2,
        }}
      />
      <View style={{ ...styles.SubscriptionMainContainer }}>
        <View>
          <View>
            <ScreenText
              label={"Our  Package Includes"}
              color={CardTextColorMapping[subscriptionCatogary]}
            />
            <View style={styles.packagesInfo}>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    borderRadius: 50,
                    backgroundColor: CardTextColorMapping[subscriptionCatogary],
                  }}
                >
                  <Tick />
                </View>
                <ScreenText
                  styles={{
                    fontFamily: theme?.fonts?.displaySmall?.fontFamily,
                  }}
                  label={"Profile Management"}
                />
              </View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,

                    borderRadius: 50,
                    backgroundColor: CardTextColorMapping[subscriptionCatogary],
                  }}
                >
                  <Tick />
                </View>
                <ScreenText
                  styles={{
                    fontFamily: theme?.fonts?.displaySmall?.fontFamily,
                  }}
                  label={"Unlimited Access"}
                />
              </View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    borderRadius: 50,

                    backgroundColor: CardTextColorMapping[subscriptionCatogary],
                  }}
                >
                  <Tick />
                </View>
                <ScreenText
                  styles={{
                    fontFamily: theme?.fonts?.displaySmall?.fontFamily,
                  }}
                  label={"Update Details"}
                />
              </View>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={styles.ButtonsContainer}>
              <OutlinedButton
                title={"Subscribe"}
                ButtonStyle={{
                  backgroundColor: CardTextColorMapping[subscriptionCatogary],
                }}
              />
              <OutlinedButton
                ButtonStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: theme?.colors?.background,
                }}
                title={"Start Free Trial"}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={{ position: "absolute", bottom: 20, right: 0 }}>
        <SubscriptionCardFlower />
      </View>
    </View>
  );
};

export default SubscriptionCard;

const styles = StyleSheet.create({
  SubscriptionContainer: { borderRadius: 40 },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  SubscriptionMainContainer: {
    flex: 1,
    justifyContent: "center",

    paddingHorizontal: 20,
  },
  ButtonsContainer: {
    marginTop: 20,
    gap: 12,
    width: "80%",
  },
  packagesInfo: {
    gap: 20,
    marginTop: 20,
  },
});
