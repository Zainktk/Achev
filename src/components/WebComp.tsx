import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import WebView from "react-native-webview";

const WebComp = () => {
  const [showMap, setShowMap] = useState(true);
  return (
    <WebView
      style={styles.webView}
      javaScriptEnabled={true}
      containerStyle={{
        position: "absolute",
        top: showMap ? 430 : 0, // Adjust positioning as needed
        left: showMap ? 140 : 0,
        right: 0,
        bottom: showMap ? 10 : 0,
        zIndex: 1000,
        backgroundColor: "transparent", // Ensure transparency

        // marginLeft: showMap ? 140 : 0,
        // marginTop: showMap ? 10 : 0,
        // marginBottom: showMap ? 5 : 0,
      }}
      originWhitelist={["*"]}
      source={{
        html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            body, html {
              margin: 0;
              padding: 0;
             background-color: red;
             position:absolute;
            }
          </style>
        </head>
        <body>
          <script>
            (function() {
              window.addEventListener("message", function(event) {
                if (event.data === "toggleMap") {
                  window.ReactNativeWebView.postMessage("toggleMap");
                }
              });

              document.addEventListener("DOMContentLoaded", function() {
                var tidioScript = document.createElement("script");
                tidioScript.src = "https://code.tidio.co/vndgds0tz32ubhsgosc8ne6tj68xut3m.js";
                tidioScript.async = true;
                tidioScript.onload = function() {
                  tidioChatApi.on("open", function() {
                    window.ReactNativeWebView.postMessage("chatOpened");
                  });
                  tidioChatApi.on("close", function() {
                    window.ReactNativeWebView.postMessage("chatClosed");
                  });
                };
                document.body.appendChild(tidioScript);
              });
            })();
          </script>
        </body>
      </html>
    `,
      }}
      onMessage={(event) => {
        if (event.nativeEvent.data === "chatOpened") {
          setShowMap(false);
        } else if (event.nativeEvent.data === "chatClosed") {
          setShowMap(true);
        }
      }}
    />
  );
};

export default WebComp;

const styles = StyleSheet.create({
  webView: { backgroundColor: "transparent" },
});
