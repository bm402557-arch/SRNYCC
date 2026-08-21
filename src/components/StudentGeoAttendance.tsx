import React, { useState, useEffect } from 'react';
import { 
  MapPin, CheckCircle2, AlertTriangle, Navigation, Clock, ShieldCheck, 
  Sparkles, RefreshCw, Calendar, Check, X, AlertCircle, Info, ChevronRight 
} from 'lucide-react';
import { Student, CenterLocationConfig, AttendanceStudentEntry } from '../types';
import { api } from '../lib/api';

interface StudentGeoAttendanceProps {
  student: Student;
  todayAttendance: AttendanceStudentEntry | null | undefined;
  centerLocation?: CenterLocationConfig;
  attendanceHistory: any[];
  onAttendanceMarked: () => void;
}

export const StudentGeoAttendance: React.FC<StudentGeoAttendanceProps> = ({
  student,
  todayAttendance: initialTodayAttendance,
  centerLocation: initialCenter,
  attendanceHistory,
  onAttendanceMarked
}) => {
  const [centerConfig, setCenterConfig] = useState<CenterLocationConfig>(
    initialCenter || {
      name: 'Shri Ramkrishna National Youth Computer Centre Main Campus',
      address: 'Vivekananda Sarani, Central Road, Kolkata, WB - 700001',
      latitude: 22.572646,
      longitude: 88.363895,
      allowedRadiusMeters: 500,
      enableGeoAttendance: true
    }
  );

  const [todayAtt, setTodayAtt] = useState<AttendanceStudentEntry | null | undefined>(initialTodayAttendance);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [useLabOverride, setUseLabOverride] = useState(false);

  useEffect(() => {
    if (initialTodayAttendance !== undefined) {
      setTodayAtt(initialTodayAttendance);
    }
  }, [initialTodayAttendance]);

  useEffect(() => {
    if (initialCenter) {
      setCenterConfig(initialCenter);
    } else {
      api.getCenterLocation().then(res => {
        if (res.success && res.centerLocation) {
          setCenterConfig(res.centerLocation);
        }
      }).catch(err => console.error('Failed to load center location', err));
    }
  }, [initialCenter]);

  // Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const handleFetchLocation = () => {
    setLocating(true);
    setGeoError(null);
    setStatusMessage(null);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser or device.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = position.coords.accuracy;

        setUserLocation({ latitude: lat, longitude: lon, accuracy: acc });
        const dist = calculateDistance(lat, lon, centerConfig.latitude, centerConfig.longitude);
        setDistanceMeters(dist);
        setLocating(false);

        if (dist <= centerConfig.allowedRadiusMeters) {
          setStatusMessage({
            type: 'success',
            text: `Location verified! You are ${dist} meters away (within the ${centerConfig.allowedRadiusMeters}m campus lab radius). Ready to mark attendance.`
          });
        } else {
          const formatted = dist >= 1000 ? `${(dist / 1000).toFixed(2)} km` : `${dist} meters`;
          setStatusMessage({
            type: 'error',
            text: `You are currently ${formatted} away from ${centerConfig.name}. To mark attendance, you must be within ${centerConfig.allowedRadiusMeters} meters of the computer lab.`
          });
        }
      },
      (error) => {
        setLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser settings to verify your campus presence.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable from your device GPS.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        setGeoError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  const handleMarkAttendance = async () => {
    setSubmitting(true);
    setStatusMessage(null);

    try {
      let lat = userLocation?.latitude;
      let lon = userLocation?.longitude;
      let acc = userLocation?.accuracy || 10;

      // If in override / simulation mode or if GPS coordinates not yet fetched
      if (useLabOverride || !lat || !lon) {
        lat = centerConfig.latitude + (Math.random() * 0.0004 - 0.0002);
        lon = centerConfig.longitude + (Math.random() * 0.0004 - 0.0002);
      }

      const res = await api.selfMarkAttendance({
        studentId: student.studentId,
        latitude: lat,
        longitude: lon,
        accuracy: acc,
        forceOverride: useLabOverride,
        remarks: useLabOverride ? 'Self Check-in (Campus Lab Override)' : `Self Check-in (GPS Verified)`
      });

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: res.message || 'Attendance marked successfully!'
        });
        if (res.entry) {
          setTodayAtt(res.entry);
        }
        onAttendanceMarked();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to mark attendance. You might be outside the center.'
        });
      }
    } catch (err: any) {
      console.error('Error marking attendance:', err);
      setStatusMessage({
        type: 'error',
        text: 'Network error while recording attendance. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics
  const totalClasses = attendanceHistory.length;
  const presentDays = attendanceHistory.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentDays / totalClasses) * 100) : 100;
  const isWithinZone = distanceMeters !== null && distanceMeters <= centerConfig.allowedRadiusMeters;

  return (
    <div className="space-y-6">
      
      {/* 1. Main Geolocation Check-In Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-[11px] font-bold text-amber-300">
                <Navigation className="w-3.5 h-3.5" />
                <span>Geo-Fenced Campus Attendance System</span>
              </div>
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight uppercase">
                Laboratory Location Check-In
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Verify your physical presence at the computer laboratory via device GPS to record today's session attendance.
              </p>
            </div>

            {/* Today's Status Badge */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3.5 text-center min-w-[200px]">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mb-1">
                Today's Attendance Status
              </span>
              {todayAtt ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-xs font-extrabold uppercase shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Marked Present</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/90 text-slate-950 rounded-lg text-xs font-extrabold uppercase shadow-sm">
                  <Clock className="w-4 h-4 text-slate-950" />
                  <span>Pending Today</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Details & Geo Radar Box */}
        <div className="p-6 space-y-6">
          
          {/* Institute Geofence Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <MapPin className="w-4 h-4 text-blue-900" />
                <span>Designated Campus Location</span>
              </div>
              <p className="text-xs font-bold text-slate-800">{centerConfig.name}</p>
              <p className="text-[11px] text-slate-500">{centerConfig.address}</p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-mono">
                <span>Coordinates: {centerConfig.latitude.toFixed(6)}°N, {centerConfig.longitude.toFixed(6)}°E</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-sans font-bold text-[10px]">
                  Allowed Radius: {centerConfig.allowedRadiusMeters}m
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Overall Student Attendance
                </span>
                <div className="text-2xl font-extrabold text-blue-950 mt-0.5">
                  {attendanceRate}%
                </div>
                <div className="text-[11px] text-slate-500">
                  {presentDays} attended out of {totalClasses || 1} sessions
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    attendanceRate >= 75 ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, attendanceRate)}%` }}
                />
              </div>
            </div>

          </div>

          {/* If already marked today */}
          {todayAtt ? (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm uppercase">
                    You have successfully marked attendance for today!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Recorded at: <strong>{todayAtt.timestamp || 'Today'}</strong> • Status:{' '}
                    <span className="uppercase font-extrabold">{todayAtt.status}</span>
                  </p>
                  {todayAtt.remarks && (
                    <p className="text-[11px] text-emerald-700 mt-1 font-mono">
                      Log: {todayAtt.remarks}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold shadow-2xs">
                  ✓ Verified by System
                </span>
              </div>
            </div>
          ) : (
            /* Check-in Action Box */
            <div className="p-5 bg-gradient-to-b from-blue-50/70 to-slate-50 border border-blue-200/80 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Step 1: Check In via Campus Geolocation</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Click the button below to retrieve your current GPS coordinates and verify proximity to the institute laboratory.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFetchLocation}
                    disabled={locating || submitting}
                    className="px-4 py-2.5 bg-blue-900 hover:bg-blue-950 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    {locating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Detecting GPS Location...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 text-amber-400" />
                        <span>{userLocation ? 'Re-scan My Location' : 'Scan My Current Location'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Geo Error Box */}
              {geoError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Location Detection Notice:</strong>
                    <span>{geoError}</span>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {statusMessage && (
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}>
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-medium">{statusMessage.text}</span>
                  </div>
                </div>
              )}

              {/* Location Verification Card */}
              {userLocation && (
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Your GPS Position:</span>
                      <strong className="font-mono text-slate-800">
                        {userLocation.latitude.toFixed(6)}°N, {userLocation.longitude.toFixed(6)}°E
                      </strong>
                      <span className="text-[10px] text-slate-400 block">
                        Accuracy: ±{Math.round(userLocation.accuracy)}m
                      </span>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-slate-500 block text-[11px]">Distance to Lab Center:</span>
                      <strong className={`text-base font-extrabold ${isWithinZone ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {distanceMeters !== null ? (distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(2)} km` : `${distanceMeters} meters`) : 'Calculating...'}
                      </strong>
                      <span className={`text-[10px] font-bold block uppercase ${isWithinZone ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isWithinZone ? '● Within Campus Perimeter' : '● Outside Permitted Campus Radius'}
                      </span>
                    </div>
                  </div>

                  {/* Submission Button */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500">
                      {isWithinZone
                        ? 'Physical location verified. You can now submit your attendance for today.'
                        : `You must be within ${centerConfig.allowedRadiusMeters}m of the lab. If you are on campus but GPS has low accuracy, toggle Campus Override below.`}
                    </div>

                    <button
                      onClick={handleMarkAttendance}
                      disabled={submitting || (!isWithinZone && !useLabOverride)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                        isWithinZone || useLabOverride
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-98'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Saving Attendance...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Confirm & Give Today's Attendance</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Lab Override / Test Mode Option */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200/60">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useLabOverride}
                    onChange={(e) => setUseLabOverride(e.target.checked)}
                    className="w-4 h-4 text-blue-900 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">
                    Campus WiFi / Lab Terminal Mode (Instructor / Dev Override)
                  </span>
                </label>

                {useLabOverride && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded border border-amber-300">
                    Override Active
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 2. Detailed Attendance History Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-900" />
              <span>Personal Attendance History Log</span>
            </h3>
            <p className="text-xs text-slate-500">Complete record of your computer laboratory sessions and entry timestamps.</p>
          </div>
          <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-950 rounded-xl text-xs font-bold">
            Total Sessions: {attendanceHistory.length}
          </div>
        </div>

        {attendanceHistory.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No historical attendance records found yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Session Date</th>
                  <th className="p-3.5">Batch</th>
                  <th className="p-3.5">Check-In Time</th>
                  <th className="p-3.5">Verification Method</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {record.date}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {record.batch || student.batch}
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      {record.timestamp || '—'}
                    </td>
                    <td className="p-3.5">
                      {record.markedBy === 'self-geo' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <Navigation className="w-3 h-3 text-blue-600" />
                          <span>Self GPS Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <ShieldCheck className="w-3 h-3 text-slate-600" />
                          <span>Admin / Instructor</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                        record.status === 'absent' ? 'bg-rose-100 text-rose-800' :
                        record.status === 'late' ? 'bg-amber-100 text-amber-900' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
