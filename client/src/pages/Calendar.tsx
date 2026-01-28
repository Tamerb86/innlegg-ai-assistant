import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import nbLocale from "@fullcalendar/core/locales/nb";
import { PostCreationDialog } from "@/components/PostCreationDialog";
import { EventDetailsDialog } from "@/components/EventDetailsDialog";

export default function Calendar() {
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek">("dayGridMonth");
  const calendarRef = useRef<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Fetch scheduled posts
  const { data: posts, isLoading, refetch } = trpc.content.getScheduledPosts.useQuery();
  const utils = trpc.useUtils();
  
  // Mutation to reschedule post
  const reschedulePost = trpc.content.reschedule.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Convert posts to FullCalendar events
  const events = posts?.map((post) => ({
    id: post.id.toString(),
    title: post.generatedContent.substring(0, 50) + "...",
    start: post.scheduledFor || undefined,
    backgroundColor: getPlatformColor(post.platform),
    borderColor: getPlatformColor(post.platform),
    extendedProps: {
      platform: post.platform,
      status: post.status,
      content: post.generatedContent,
    },
  })) || [];

  // Handle date click (double-click to create new post)
  const handleDateClick = (info: any) => {
    setSelectedDate(new Date(info.dateStr));
    setDialogOpen(true);
  };

  // Handle event click (view/edit post)
  const handleEventClick = (info: any) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      extendedProps: info.event.extendedProps,
    });
    setEventDialogOpen(true);
  };

  // Handle edit event
  const handleEditEvent = (eventId: string) => {
    // Navigate to posts page with filter
    window.location.href = `/posts?id=${eventId}`;
  };

  // Handle delete event
  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Er du sikker på at du vil slette dette innlegget?")) {
      // TODO: Implement delete mutation
      console.log("Delete event:", eventId);
    }
  };

  // Handle event drop (reschedule)
  const handleEventDrop = (info: any) => {
    const postId = parseInt(info.event.id);
    const newDate = info.event.start;
    
    if (!newDate) {
      info.revert();
      return;
    }
    
    // Update scheduledFor in database
    reschedulePost.mutate(
      { postId, scheduledFor: newDate.getTime() },
      {
        onError: () => {
          // Revert if mutation fails
          info.revert();
        },
      }
    );
  };

  // Jump to today
  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  // Change view
  const handleViewChange = (newView: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek") => {
    console.log("[Calendar] Changing view to:", newView);
    console.log("[Calendar] calendarRef.current:", calendarRef.current);
    setView(newView);
    const calendarApi = calendarRef.current?.getApi();
    console.log("[Calendar] calendarApi:", calendarApi);
    if (calendarApi) {
      console.log("[Calendar] Calling changeView...");
      calendarApi.changeView(newView);
    } else {
      console.error("[Calendar] calendarApi is null!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Kalender</h1>
            <p className="text-muted-foreground">Planlegg og administrer innleggene dine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToday}>
            I dag
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nytt innlegg
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant={view === "dayGridMonth" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("dayGridMonth")}
          >
            Måned
          </Button>
          <Button
            variant={view === "timeGridWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("timeGridWeek")}
          >
            Uke
          </Button>
          <Button
            variant={view === "timeGridDay" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("timeGridDay")}
          >
            Dag
          </Button>
          <Button
            variant={view === "listWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("listWeek")}
          >
            Liste
          </Button>
        </div>
      </Card>

      {/* Calendar */}
      <Card className="p-6">
        <FullCalendar
          key={view}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }}
          locale={nbLocale}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.8}
        />
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Plattformer</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-sm">LinkedIn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sky-400"></div>
            <span className="text-sm">Twitter/X</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-700"></div>
            <span className="text-sm">Facebook</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <span className="text-sm">Instagram</span>
          </div>
        </div>
      </Card>

      {/* Post Creation Dialog */}
      <PostCreationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
      />

      {/* Event Details Dialog */}
      <EventDetailsDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}

// Helper function to get platform color
function getPlatformColor(platform: string): string {
  switch (platform) {
    case "linkedin":
      return "#3b82f6"; // blue-500
    case "twitter":
      return "#38bdf8"; // sky-400
    case "facebook":
      return "#1d4ed8"; // blue-700
    case "instagram":
      return "#a855f7"; // purple-500
    default:
      return "#6b7280"; // gray-500
  }
}
