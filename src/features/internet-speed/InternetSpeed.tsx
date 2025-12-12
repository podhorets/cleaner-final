import {
  useSpeedTest,
  useUploadSpeedTest,
} from "@/src/services/networkService";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useUserRepository } from "@/src/shared/database/hooks/useUserRepository";
import { ArrowDown, ArrowUp } from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { Button, Card, Stack, Text, XStack, YStack } from "tamagui";

type TestState = "idle" | "testing-download" | "testing-upload" | "completed";

type TestResult = {
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
  date: Date | null;
};

const TEST_FILE_URL = "https://speed.cloudflare.com/__down?bytes=10000000";
const TEST_FILE_SIZE = 10_000_000; // bytes
const UPLOAD_ENDPOINT = "https://speed.cloudflare.com/__up";
const UPLOAD_SIZE = 2_000_000; // bytes

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function InternetSpeed() {
  const { startTest: startDownloadTest } = useSpeedTest();
  const { startUploadTest } = useUploadSpeedTest();
  const { getUser, updateUser } = useUserRepository();

  const [gradientColors, setGradientColors] = useState(["#3b82f6", "#2563eb"]);

  const [testState, setTestState] = useState<TestState>("idle");
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const [currentTestResult, setCurrentTestResult] = useState<TestResult>({
    downloadSpeed: null,
    uploadSpeed: null,
    ping: null,
    date: null,
  });
  const [dbDownloadSpeed, setDbDownloadSpeed] = useState<number | null>(null);
  const [dbUploadSpeed, setDbUploadSpeed] = useState<number | null>(null);
  const [dbLastSpeedTest, setDbLastSpeedTest] = useState<string | null>(null);

  // Animation values
  const progressValue = useRef(new Animated.Value(0)).current;
  const uploadStartedRef = useRef(false);

  // Circle configuration
  const size = 300;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Load speed history from database on mount
  useEffect(() => {
    const loadHistory = async () => {
      const user = await getUser();
      if (user) {
        setDbDownloadSpeed(user.downloadSpeed);
        setDbUploadSpeed(user.uploadSpeed);
        setDbLastSpeedTest(user.lastSpeedTest);
      }
    };
    loadHistory();
  }, [getUser]);

  // Format speed value for display
  const formatSpeed = (speed: number | null): string => {
    if (speed === null || speed < 0) return "--.--";
    return speed.toFixed(2);
  };

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "-";
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  // Animate progress circle
  const animateProgress = (toValue: number, duration: number = 200) => {
    Animated.timing(progressValue, {
      toValue,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  // Start speed test
  const startTest = async () => {
    setTestState("testing-download");
    setAnimatedSpeed(0);
    setGradientColors(["#3b82f6", "#2563eb"]); // Blue for download
    progressValue.setValue(0);
    uploadStartedRef.current = false;
    setCurrentTestResult({
      downloadSpeed: null,
      uploadSpeed: null,
      ping: null,
      date: null,
    });

    try {
      // Measure ping
      const pingStart = Date.now();
      await fetch(TEST_FILE_URL, { method: "HEAD" }).catch(() => {});
      const ping = (Date.now() - pingStart) / 2;

      // Start download test
      const downloadResult = await startDownloadTest(
        TEST_FILE_URL,
        TEST_FILE_SIZE,
        (update) => {
          setAnimatedSpeed(update.avgMbps);
          animateProgress(update.progress);
        },
        {
          connections: 8,
          sampleIntervalMs: 100,
          maxTestDurationMs: 8000,
        }
      );

      const downloadSpeed = downloadResult.finalAvgMbps;
      setTimeout(() => {
        handleDownloadComplete(downloadSpeed, ping);
      }, 500);
    } catch (error) {
      console.error("Speed test error:", error);
      setTestState("completed");
    }
  };

  const handleDownloadComplete = async (
    downloadSpeed: number,
    ping: number
  ) => {
    setCurrentTestResult((prev) => ({
      ...prev,
      downloadSpeed,
      ping,
    }));

    // Start upload test
    uploadStartedRef.current = true;
    setTestState("testing-upload");
    setAnimatedSpeed(0);
    setGradientColors(["#22c55e", "#16a34a"]); // Green for upload
    progressValue.setValue(0); // Reset progress for upload
    animateProgress(0);

    try {
      const uploadResult = await startUploadTest(
        UPLOAD_ENDPOINT,
        UPLOAD_SIZE,
        (update) => {
          setAnimatedSpeed(update.avgMbps);
          animateProgress(update.progress);
        },
        {
          connections: 8,
          sampleIntervalMs: 100,
          maxTestDurationMs: 8000,
        }
      );

      const uploadSpeed = uploadResult.finalAvgMbps;
      handleUploadComplete(downloadSpeed, uploadSpeed, ping);
    } catch (error) {
      console.error("Upload test error:", error);
      setTestState("completed");
    }
  };

  const handleUploadComplete = (
    downloadSpeed: number,
    uploadSpeed: number,
    ping: number
  ) => {
    const finalResult: TestResult = {
      downloadSpeed,
      uploadSpeed,
      ping,
      date: new Date(),
    };

    setCurrentTestResult(finalResult);

    // Save to database
    const now = new Date().toISOString();
    updateUser({ 
      downloadSpeed, 
      uploadSpeed,
      lastSpeedTest: now
    }).then((user) => {
      setDbDownloadSpeed(user.downloadSpeed);
      setDbUploadSpeed(user.uploadSpeed);
      setDbLastSpeedTest(user.lastSpeedTest);
    });

    setTimeout(() => {
      setTestState("completed");
      setCurrentTestResult({
        downloadSpeed: null,
        uploadSpeed: null,
        ping: null,
        date: null,
      });
      setAnimatedSpeed(0);
      progressValue.setValue(0);
      uploadStartedRef.current = false;
    }, 800);
  };

  // Get current speed value based on test state
  const getCurrentSpeed = (): number | null => {
    if (testState === "testing-download" || testState === "testing-upload") {
      return animatedSpeed;
    }
    // When idle or completed, show --.-- instead of last result
    return null;
  };

  // Get status text
  const getStatusText = (): string => {
    if (testState === "testing-download") return "Testing Download...";
    if (testState === "testing-upload") return "Testing Upload...";
    return "";
  };

  // When completed or idle, show current (reset) values in main card
  // History card shows values from database
  const displayResult = currentTestResult;
  const hasHistory = dbDownloadSpeed !== null || dbUploadSpeed !== null;

  // Interpolate progress for SVG strokeDashoffset
  const strokeDashoffset = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title="Speed Test" />

      <YStack flex={1} px="$4" pb="$8">
        {/* Main Speed Display */}
        <YStack flex={1} items="center" justify="center" gap="$2">
          <Stack width={size} height={size} items="center" justify="center">
            <Svg width={size} height={size}>
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <Stop
                    offset="0"
                    stopColor={gradientColors[0]}
                    stopOpacity="1"
                  />
                  <Stop
                    offset="1"
                    stopColor={gradientColors[1]}
                    stopOpacity="1"
                  />
                </LinearGradient>
              </Defs>
              {/* Background Circle */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#333"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeOpacity={0.2}
              />
              {/* Progress Circle */}
              <AnimatedCircle
                cx={center}
                cy={center}
                r={radius}
                stroke="url(#grad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            </Svg>

            {/* Speed Value Overlay */}
            <YStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              items="center"
              justify="center"
              gap="$2"
            >
              {testState !== "idle" && testState !== "completed" && (
                <Text fs={16} fw="$regular" color="$gray3" o={0.7}>
                  {getStatusText()}
                </Text>
              )}
              <Text fs={64} fw="$bold" color="$white">
                {formatSpeed(getCurrentSpeed())}
              </Text>
              <Text fs={16} fw="$regular" color="$gray3">
                Mb/s
              </Text>
            </YStack>
          </Stack>
        </YStack>

        {/* Stats Section */}
        <YStack gap="$3.5">
          {/* Ping */}
          <XStack px="$2" py={0} items="center" justify="space-between">
            <Text fs={14} fw="$regular" color="$gray3">
              Ping
            </Text>
            <XStack gap={4} items="baseline">
              <Text fs={16} fw="$light" color="$gray3">
                {displayResult.ping
                  ? `${displayResult.ping.toFixed(1)}`
                  : "--.--"}
              </Text>
              <Text fs={13} fw="$light" color="$gray3">
                Ms
              </Text>
            </XStack>
          </XStack>

          {/* Download/Upload Card */}
          <Card bg="$whiteAlpha13" br="$4" p="$4">
            <XStack items="center" justify="space-between">
              {/* Download Section */}
              <YStack flex={1} items="center" gap="$2">
                <XStack items="center" gap="$2">
                  <ArrowDown size={16} color="$blueTertiary" />
                  <Text fs={14} fw="$regular" color="$white">
                    Download
                  </Text>
                </XStack>
                <YStack items="center">
                  <Text fs={28} fw="$medium" color="$white">
                    {formatSpeed(displayResult.downloadSpeed)}
                  </Text>
                  <Text fs={14} fw="$regular" color="$gray3">
                    Mb/s
                  </Text>
                </YStack>
              </YStack>

              {/* Divider */}
              <Stack width={1} height={60} bg="$gray3" o={0.2} />

              {/* Upload Section */}
              <YStack flex={1} items="center" gap="$2">
                <XStack items="center" gap="$2">
                  <ArrowUp size={16} color="$green" />
                  <Text fs={14} fw="$regular" color="$white">
                    Upload
                  </Text>
                </XStack>
                <YStack items="center">
                  <Text fs={28} fw="$medium" color="$white">
                    {formatSpeed(displayResult.uploadSpeed)}
                  </Text>
                  <Text fs={14} fw="$regular" color="$gray3">
                    Mb/s
                  </Text>
                </YStack>
              </YStack>
            </XStack>
          </Card>

          {/* Last Test Date */}
          <XStack px="$2" py={0} items="center" justify="space-between">
            <Text fs={14} fw="$regular" color="$gray3">
              Last Test:
            </Text>
            <Text
              fs={16}
              fw="$regular"
              color="$gray3"
            >
              {hasHistory ? formatDate(dbLastSpeedTest ? new Date(dbLastSpeedTest) : null) : "-"}
            </Text>
          </XStack>

          {/* History Card */}
          <Card bg="$whiteAlpha13" br="$4" p="$4">
            {hasHistory ? (
              <XStack items="center" justify="space-between">
                <YStack flex={1} items="center">
                  <Text fs={18} fw="$regular" color="$white">
                    {formatSpeed(dbDownloadSpeed)} Mb/s
                  </Text>
                </YStack>
                <Stack width={1} height={20} bg="$gray3" o={0.3} />
                <YStack flex={1} items="center">
                  <Text fs={18} fw="$regular" color="$white">
                    {formatSpeed(dbUploadSpeed)} Mb/s
                  </Text>
                </YStack>
              </XStack>
            ) : (
              <YStack items="center" justify="center" minHeight={24}>
                <Text fs={16} fw="$light" color="$gray3">
                  No data
                </Text>
              </YStack>
            )}
          </Card>
        </YStack>

        {/* Start Test Button */}
        <YStack mt="$6">
          <Button
            bg="$blueTertiary"
            br="$6"
            h={55}
            pressStyle={{ opacity: 0.8 }}
            onPress={
              testState === "idle" || testState === "completed"
                ? startTest
                : undefined
            }
            disabled={
              testState === "testing-download" || testState === "testing-upload"
            }
            opacity={
              testState === "testing-download" || testState === "testing-upload"
                ? 0.6
                : 1
            }
          >
            <Text fs={17} fw="$semibold" color="$white">
              {testState === "idle" || testState === "completed"
                ? "Start Test"
                : "Testing..."}
            </Text>
          </Button>
        </YStack>
      </YStack>
    </YStack>
  );
}
