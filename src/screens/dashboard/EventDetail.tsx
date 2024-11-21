import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Calendericon, Filtericon, createUserInfo } from "@utils";
import HomedetailsHeader from "../../components/HomedetailsHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreenFlowType } from "../../navigation/dashboard/HomeNavigator";
import { useTheme } from "react-native-paper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import EventsComp from "../../components/EventsComp";
import FilterEvents from "../../components/FilterEvents";
import RBSheet from "react-native-raw-bottom-sheet";
import SelectDay from "../../components/SelectDay";
import SelectCity from "../../components/SelectCity";
import axios from "axios";
import SelectVenue from "../../components/SelectVenue";
import { Buffer } from "buffer";
import { Buttonn, OutlinedButton } from "@atoms";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";

if (global.Buffer == null) {
  global.Buffer = Buffer;
}

type User = {
  firstName: string;
  lastName: string;
  nickName: string;
  emergencyNo: string;
  state: string;
  dob: Date | null;
  agreePrivacyPolicy?: boolean;
  emergencyContactName: string;
};

const EventDetail = () => {
  const theme = useTheme();
  type Eventtypes = { item: { image: any; title: string; Time: string } };

  const venues = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm<User>({
    resolver: yupResolver(createUserInfo),
    defaultValues: {
      firstName: "",
      lastName: "",
      emergencyContactName: "",
      nickName: "",
      emergencyNo: "",
      state: "",
      dob: null,
      agreePrivacyPolicy: false,
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [startRangeDate, setStartRangeDate] = useState<string | null>(null);
  const [endRangeDate, setEndRangeDate] = useState<string | null>(null);
  const [isSelectingEndRange, setIsSelectingEndRange] =
    useState<boolean>(false);
  const [isFirstRangeSelected, setIsFirstRangeSelected] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dimOpacity, setDimOpacity] = useState(0);
  const [venuePress, setvenuePress] = useState(false);
  const [dayPress, setdayPress] = useState(false);
  const [CityPress, setCityPress] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [ExtendedEvent, setExtendedEvent] = useState([]);
  const [searchiconPress, setsearchiconPress] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { image: string; Article: string; imagelist: string }[]
  >([]);
  const [selectedDays, setSelectedDays] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [dayfilteredEvents, setDayFilteredEvents] = useState([]);
  const [selectvenue, setSelectedvenue] = useState("");
  const [originalEvents, setOriginalEvents] = useState([]);
  const [isTodayDateSelection, setisTodayDateSelection] = useState(false);
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [AllEvents, setAllEvents] = useState<any[]>([]);
  const [firstRender, setfirstRender] = useState<boolean>(true);
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();

  const rbSheetRef = useRef<RBSheet>(null);

  const dimColor = `rgba(250, 243, 240, ${1 - dimOpacity})`;
  const dimOpacityvar = 0.75;
  const dimColorarrow = `rgba(0,0, 0, ${1 - dimOpacityvar})`;

  const onPressback = () => {
    homeStack.navigate("home");
  };

  const onPressFilter = () => {
    setShowFilterModal(!showFilterModal);
    setDimOpacity(showFilterModal ? 0 : 0.5);
    if (rbSheetRef.current) {
      rbSheetRef.current.open();
    }
  };

  const onPress = (serviceId: any, eventId: any) => {
    setSelectedEventId(eventId);
    homeStack.navigate("downloadEvent", {
      eventId: eventId,
      param: "eventdetail",
    });
  };

  const ViewEvents = () => {
    console.log("called--->>>>>>");
    if (startRangeDate && endRangeDate) {
      setOpen(false);
      fetchEvents(startRangeDate, endRangeDate);
      setInitialRender(false);
      setfirstRender(false);
    }
  };
  const Reset = () => {
    setfirstRender(true);
    setStartRangeDate(null);
    setEndRangeDate(null);
    setSelectedCity("");
    setSelectedDays("");
    setSelectedvenue("");
    setFilteredEvents([]);
    setAllEvents([]);
    fetchEvents(null, null);
  };
  const onDayPress = (day: { dateString: string }) => {
    if (!startRangeDate || (startRangeDate && endRangeDate)) {
      setStartRangeDate(day.dateString);
      setEndRangeDate(null);
      setIsSelectingEndRange(false);
      setIsFirstRangeSelected(true);
      setfirstRender(false);
    } else {
      if (new Date(startRangeDate) < new Date(day.dateString)) {
        setEndRangeDate(day.dateString);
        setfirstRender(false);
      } else {
        setStartRangeDate(day.dateString);
        setEndRangeDate(null);
        setIsSelectingEndRange(false);
        setfirstRender(false);
      }
    }
  };

  const encodeBase64 = (str) => {
    return Buffer.from(str).toString("base64");
  };

  const onpressVenue = () => {
    setvenuePress(true);
  };

  const onpressVenueListBack = () => {
    setvenuePress(false);
  };

  const onpressDay = () => {
    setdayPress(true);
  };
  const onpressDayListBack = () => {
    setdayPress(false);
  };

  const onpressCity = () => {
    setCityPress(true);
  };
  const onpressCityListBack = () => {
    setCityPress(false);
  };

  const getMiddleRangeDates = (start: string, end: string) => {
    const middleDates: Record<string, { color: string; textColor: string }> =
      {};
    const currentDate = new Date(start);
    while (currentDate < new Date(end)) {
      const dateString = currentDate.toISOString().split("T")[0];
      middleDates[dateString] = {
        color: "rgba(224, 79, 57, 1)",
        textColor: "white",
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return middleDates;
  };

  const onPressCalender = () => {
    setIsFirstRangeSelected(false);
    setOpen(!open);
  };

  const onPressApplyfilter = () => {
    filterEvents();
    setShowFilterModal(!showFilterModal);
    setDimOpacity(showFilterModal ? 0 : 0.5);
    if (rbSheetRef.current) {
      rbSheetRef.current.close();
    }
  };
  const onpressSearch = () => {
    setsearchiconPress(!searchiconPress);
    setSearchQuery("");
  };
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    filterData(text);
  };

  const filterData = (query: string) => {
    const lowerCaseQuery =
      query && typeof query === "string" ? query.toLowerCase() : "";

    const filteredData = filteredEvents.filter((item) =>
      item?.title.toLowerCase().includes(lowerCaseQuery)
    );
    setSearchResults(filteredData);
  };

  // GET Request
  const fetchEvents = async (
    startDate: string | null,
    endDate: string | null
  ) => {
    try {
      const username = "emaz@doerz.tech";
      const password = "ZeKfy!ngHBUkMVWNKIRdL2lQ";
      const authString = `${username}:${password}`;
      const encodedAuthString = encodeBase64(authString);
      setLoading(true);

      let response;
      if (initialRender || (!startDate && !endDate)) {
        response = await axios.get(
          `https://achev.ca/wp-json/tribe/events/v1/events?_embed`,
          {
            params: {
              per_page: 1000,
            },
          }
        );
      } else {
        response = await axios.get(
          `https://achev.ca/wp-json/tribe/events/v1/events?_embed`,
          {
            params: {
              start_date: startDate,
              end_date: endDate,
              per_page: 12,
            },
          }
        );
      }

      console.log("response---->>>>>>----------------------", response.data);
      const parsedData = response.data.events.map((item: any) => ({
        id: item.id,
        title: item.title,
        date: item.start_date,
        end_date: item.end_date,
        image: item.image.url,
        day: new Date(item.start_date).toLocaleString("en-US", {
          weekday: "long",
        }),
        venue: item.venue.venue,
        description: item.description,
        city: item.venue.city,
      }));

      setFilteredEvents(parsedData);
      setOriginalEvents(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  // const fetchEvents = async (
  //   startDate: string | null,
  //   endDate: string | null
  // ) => {
  //   try {
  //     const username = "emaz@doerz.tech";
  //     const password = "ZeKfy!ngHBUkMVWNKIRdL2lQ";
  //     const authString = `${username}:${password}`;
  //     const encodedAuthString = encodeBase64(authString);
  //     setLoading(true);

  //     let allEvents: any[] = [];
  //     let currentPage = 1;
  //     let totalPages = 1;

  //     // Define the base URL
  //     const baseUrl = `https://achev.ca/wp-json/tribe/events/v1/events?_embed`;

  //     // Fetch events with pagination
  //     while (currentPage <= totalPages) {
  //       let response;

  //       // Fetch all events if no startDate and endDate are provided (initialRender)
  //       if (initialRender || (!startDate && !endDate)) {
  //         response = await axios.get(baseUrl, {
  //           params: {
  //             per_page: 1000, // Fetch max events per page
  //             page: currentPage, // Current page for pagination
  //           },
  //         });
  //       } else {
  //         // Fetch events within the specified date range
  //         response = await axios.get(baseUrl, {
  //           params: {
  //             start_date: startDate,
  //             end_date: endDate,
  //             per_page: 12, // Fetch max 12 events per page for date filtering
  //             page: currentPage, // Current page for pagination
  //           },
  //         });
  //       }

  //       // Merge events from each page into allEvents array
  //       allEvents = [...allEvents, ...response.data.events];

  //       // Get total pages from the API response (if available)
  //       totalPages = response.data.total_pages || 1;

  //       // Increment the currentPage for the next loop iteration
  //       currentPage++;
  //     }

  //     // Parse the data
  //     const parsedData = allEvents.map((item: any) => ({
  //       id: item.id,
  //       title: item.title,
  //       date: item.start_date,
  //       end_date: item.end_date,
  //       image: item.image.url,
  //       day: new Date(item.start_date).toLocaleString("en-US", {
  //         weekday: "long",
  //       }),
  //       venue: item.venue.venue,
  //       description: item.description,
  //       city: item.venue.city,
  //     }));

  //     // Set the parsed events to state
  //     setFilteredEvents(parsedData);
  //     setOriginalEvents(parsedData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching events:", error);
  //     setLoading(false);
  //   }
  // };

  // const generateToken = async () => {
  //   try {
  //     const username = "doerztech";
  //     const password = "ZeKfy!ngHBUkMVWNKIRdL2lQ";
  //     const authString = `${username}:${password}`;
  //     const encodedAuthString = encodeBase64(authString);

  //     const response = await axios.post(
  //       "https://achev.ca/wp-json/jwt-auth/v1/token",
  //       null,
  //       {
  //         headers: {
  //           Authorization: `Basic ${encodedAuthString}`,
  //         },
  //       }
  //     );

  //     console.log("Token:", response.data.token);
  //     return response.data.token; // Store or use the token as needed
  //   } catch (error) {
  //     console.error(
  //       "Error generating token:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  let today;
  useEffect(() => {
    today = new Date().toISOString().split("T")[0];
    setSelected(today);
    setStartRangeDate(today);
    fetchEvents(today, today);
    setisTodayDateSelection(true);
    setInitialRender(false);
  }, []);

  console.log();

  const filterEvents = () => {
    let filtered = originalEvents;
    console.log("filtered-------------------------------->>>>>>", filtered);
    if (selectedDays) {
      console.log("Filtering by day:=====>>>>>", selectedDays);
      filtered = filtered.filter((event: any) => {
        console.log("Event day:", event?.day);
        return event?.day === selectedDays;
      });
    }
    if (selectvenue) {
      console.log("Filtering by venue:=====>>>>>", selectvenue);
      filtered = filtered.filter((event: any) => {
        console.log("Event venue:====>>>>>", event?.venue);
        return event?.venue === selectvenue;
      });
    }
    if (selectedCity) {
      console.log("Filtering by City:=====>>>>>", selectedCity);
      filtered = filtered.filter((event: any) => {
        console.log("Event City:====>>>>>", event?.city);
        return event?.city === selectedCity;
      });
    }

    setFilteredEvents(filtered);
  };
  console.log(
    "originalNEww---------->>>>>>>>",
    filteredEvents.map((serv) => serv?.serviceId)
  );

  const Resetfilter = () => {
    setfirstRender(true);
    setStartRangeDate(null);
    setEndRangeDate(null);
    setSelectedCity("");
    setSelectedDays("");
    setSelectedvenue("");
    setFilteredEvents([]);
    setAllEvents([]); // Reset to show all events again after filter is cleared
    fetchEvents(null, null); // Refetch events with no date range after resetting filters
  };

  if (loading) {
    return (
      <LottieView
        source={AchevLoader}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
          justifyContent: "center",
          alignSelf: "center",
          flex: 1,
        }}
      />
    );
  }

  console.log("initialRender---------->>>>>>", initialRender);

  console.log("ExtendedEvent------------->>>>>>>>", ExtendedEvent);

  console.log(
    "VenueName------------->>>>",
    originalEvents.map((item) => item?.city)
  );

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
      <View></View>
      <HomedetailsHeader
        prop={"EventDeatils"}
        onpressSearch={onpressSearch}
        searchiconPress={searchiconPress}
        onSearchChange={handleSearchChange}
        onPressback={onPressback}
        backgroundcolor={""}
        searchQuery={searchQuery}
      />
      <View style={[styles.container]}>
        <TouchableOpacity
          onPress={onPressCalender}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: " rgba(250, 243, 240, 1)",
            borderRadius: 30,
            paddingHorizontal: 15,
            paddingVertical: 10,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Conditional rendering for start and end dates */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {firstRender ? (
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 16,
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                  }}
                >
                  Choose a date
                </Text>
              ) : (
                <>
                  {startRangeDate && (
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: 16,
                        color: theme.colors.primary,
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                      }}
                    >
                      {new Date(startRangeDate).toLocaleString("default", {
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  )}
                  {endRangeDate && (
                    <>
                      <Text style={{ paddingHorizontal: 5 }}>-</Text>
                      <Text
                        style={{
                          fontWeight: "400",
                          fontSize: 16,
                          color: theme.colors.primary,
                          fontFamily: theme.fonts.labelLarge.fontFamily,
                        }}
                      >
                        {new Date(endRangeDate).toLocaleString("default", {
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </>
                  )}
                </>
              )}
            </View>

            {/* Calendar Icon */}
            <View style={{ marginLeft: 10 }}>
              <Calendericon />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 30,
            width: 80,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
          onPress={onPressFilter}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Filtericon />
            <Text>Filter</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity onPress={onPressCalender}>
        <Text >
          {isTodayDateSelection && "Choose a date" }
        </Text>
      </TouchableOpacity> */}
      {open && (
        <View style={{ marginTop: 10 }}>
          <Calendar
            current={selectedDate?.toISOString()}
            onDayPress={onDayPress}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },

              [startRangeDate]: {
                startingDay: true,
                color: "rgba(224, 79, 57, 1)",
                textColor: "white",
              },
              [endRangeDate]: {
                endingDay: true,
                color: "rgba(224, 79, 57, 1)",
                textColor: "white",
              },
              ...getMiddleRangeDates(startRangeDate!, endRangeDate!),
            }}
            markingType={"period"}
          />

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginHorizontal: 30,
            }}
          >
            <OutlinedButton
              title={"Reset"}
              ButtonStyle={{
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                width: 150,
              }}
              onPress={Reset}
            />
            <Buttonn
              title={"View"}
              ButtonStyle={{ width: 150 }}
              onPress={ViewEvents}
            />
          </View>
        </View>
      )}
      <View style={{ flex: 2 }}>
        {searchQuery !== "" ? (
          <FlatList
            data={searchQuery !== "" ? searchResults : filteredEvents}
            renderItem={({ item }) => (
              <EventsComp
                title={item.title}
                image={item.image}
                Time={item.date}
                end_date={item.end_date}
                onPress={() => onPress(item.serviceId, item.id)}
                venue={item?.venue}
              />
            )}
            contentContainerStyle={{
              marginHorizontal: 30,
              gap: 20,
              marginTop: 20,
              paddingBottom: 40,
            }}
          />
        ) : (
          <FlatList
            data={searchQuery !== "" ? searchResults : filteredEvents}
            renderItem={({ item }) => {
              console.log("Current item:------------------->>>>>>>", item); // Log the item

              return (
                <EventsComp
                  title={item.title}
                  image={item.image}
                  Time={item.date}
                  end_date={item.end_date}
                  onPress={() => onPress(item.serviceId, item.id)}
                  venue={item?.venue}
                />
              );
            }}
            contentContainerStyle={{
              marginHorizontal: 30,
              gap: 20,
              marginTop: 20,
              paddingBottom: 40,
            }}
          />
        )}
      </View>
      <View style={{}}>
        <RBSheet
          ref={rbSheetRef}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: dayPress ? 550 : CityPress ? 450 : 350,
            },
          }}
        >
          {venuePress ? (
            <ScrollView style={{ marginTop: 15 }}>
              <SelectVenue
                onpressVenueListBack={onpressVenueListBack}
                setSelectedvenue={setSelectedvenue}
                selectvenue={selectvenue}
                filteredEvents={filteredEvents}
              />
            </ScrollView>
          ) : dayPress ? (
            <SelectDay
              onpressDayListBack={onpressDayListBack}
              venues={venues}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              onPressApplyfilter={onPressApplyfilter}
            />
          ) : CityPress ? (
            <SelectCity
              onpressCityListBack={onpressCityListBack}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              onPressApplyfilter={onPressApplyfilter}
            />
          ) : (
            <View style={{ marginTop: 20 }}>
              <FilterEvents
                onPressBack={onPressFilter}
                onpressVenue={onpressVenue}
                onPressApplyfilter={onPressApplyfilter}
                onpressDay={onpressDay}
                onpressCity={onpressCity}
                selectedDays={selectedDays}
                selectvenue={selectvenue}
                selectedcity={selectedCity}
                setShowFilterModal={setShowFilterModal}
                Resetfilter={Resetfilter}
              />
            </View>
          )}
        </RBSheet>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterModalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
});

export default EventDetail;
