import React, { useRef, useEffect } from "react";
import { Track } from "twilio-video";
import { VideoContainer } from "../styled";

interface VideoTrackProps {
  track: any;
  priority?: Track.Priority | null;
  isPreview: boolean;
  identity?: string;
}

export default function VideoTrack({
  track,
  isPreview,
  priority,
  identity,
}: VideoTrackProps) {
  const vTrack = isPreview ? track : track.track;
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (vTrack?.setPriority && priority) {
      vTrack.setPriority(priority);
    }

    vTrack.attach(el);

    return () => {
      vTrack?.detach(el);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;

      if (vTrack?.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        vTrack?.setPriority(null);
      }
    };
  }, [vTrack, priority]);

  // The local video track is mirrored if it is not facing the environment.
  //const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== "environment";
  const style = {
    transform: "",
    objectFit: "cover" as const,
  };

  return <VideoContainer ref={ref} style={style} />;
}
