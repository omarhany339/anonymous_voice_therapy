import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SessionRoomProps {
  sessionId: number;
  doctorName: string;
  duration: number; // in minutes
}

export default function SessionRoom({ sessionId, doctorName, duration }: SessionRoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // in seconds
  const [sessionStatus, setSessionStatus] = useState<"waiting" | "active" | "ended">("waiting");

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize WebRTC connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        localStreamRef.current = stream;

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: ["stun:stun.l.google.com:19302"] },
            { urls: ["stun:stun1.l.google.com:19302"] },
          ],
        });

        peerConnectionRef.current = peerConnection;

        // Add local stream
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0];
          }
        };

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
          if (peerConnection.connectionState === "connected") {
            setIsConnected(true);
            setSessionStatus("active");
          } else if (peerConnection.connectionState === "failed") {
            setIsConnected(false);
            setSessionStatus("ended");
          }
        };

        setIsConnected(true);
        setSessionStatus("active");
      } catch (error) {
        console.error("Failed to initialize connection:", error);
        setSessionStatus("ended");
      }
    };

    initializeConnection();

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  // Timer
  useEffect(() => {
    if (sessionStatus !== "active") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setSessionStatus("ended");
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStatus]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleAudio = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const endSession = async () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    setIsConnected(false);
    setSessionStatus("ended");

    // TODO: Send session end event to server
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Session Header */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">جلسة استشارية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor Info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">{doctorName}</h2>
                <p className="text-muted-foreground">معالج نفسي متخصص</p>
              </div>

              {/* Connection Status */}
              {!isConnected && sessionStatus !== "ended" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    جاري الاتصال بالمعالج... يرجى الانتظار
                  </AlertDescription>
                </Alert>
              )}

              {sessionStatus === "ended" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    انتهت الجلسة. شكراً لك على استخدامك منصتنا.
                  </AlertDescription>
                </Alert>
              )}

              {/* Timer */}
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground mb-2">الوقت المتبقي</p>
                <p className="text-4xl font-bold text-primary">{formatTime(timeRemaining)}</p>
              </div>

              {/* Audio Elements */}
              <audio ref={localAudioRef} autoPlay muted />
              <audio ref={remoteAudioRef} autoPlay />

              {/* Controls */}
              {sessionStatus === "active" && (
                <div className="flex gap-4 justify-center">
                  {/* Mute Button */}
                  <Button
                    size="lg"
                    variant={isMuted ? "destructive" : "outline"}
                    onClick={toggleMute}
                    className="rounded-full w-16 h-16 p-0"
                  >
                    {isMuted ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </Button>

                  {/* Volume Button */}
                  <Button
                    size="lg"
                    variant={isAudioEnabled ? "outline" : "destructive"}
                    onClick={toggleAudio}
                    className="rounded-full w-16 h-16 p-0"
                  >
                    {isAudioEnabled ? (
                      <Volume2 className="w-6 h-6" />
                    ) : (
                      <VolumeX className="w-6 h-6" />
                    )}
                  </Button>

                  {/* End Call Button */}
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={endSession}
                    className="rounded-full w-16 h-16 p-0"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </Button>
                </div>
              )}

              {sessionStatus === "ended" && (
                <div className="flex gap-4">
                  <Button className="flex-1" variant="outline">
                    العودة للصفحة الرئيسية
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    حجز جلسة أخرى
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الجلسة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">معرف الجلسة:</span>
                <span className="font-semibold">{sessionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">حالة الاتصال:</span>
                <span className={`font-semibold ${isConnected ? "text-green-600" : "text-yellow-600"}`}>
                  {isConnected ? "متصل" : "جاري الاتصال"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مدة الجلسة:</span>
                <span className="font-semibold">{duration} دقيقة</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
