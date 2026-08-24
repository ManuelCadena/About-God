"""
Synthetic Data Generator for Bioelectric Pest Detection
========================================================
Generates realistic Vmem signals with occasional pest/disease events
for demonstration and testing purposes.

Author: Dr. José Manuel Cadena
Date: 15-Jan-2026
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import random


@dataclass
class SyntheticEvent:
    """Represents a synthetic pest/disease detection event."""
    threat_type: str
    start_hour: int
    duration_hours: int
    amplitude: float
    frequency_shift: float


class SyntheticVmemGenerator:
    """
    Generates realistic synthetic Vmem data for demonstration.
    
    The generator creates:
    1. Baseline circadian rhythm (-70 mV ± 5 mV daily cycle)
    2. Random noise (σ = 2 mV)
    3. Occasional pest/disease events with characteristic signatures
    """
    
    # Base parameters for Persian lime
    BASELINE_VMEM = -70.0  # mV
    DAILY_AMPLITUDE = 5.0  # mV (circadian rhythm)
    NOISE_STD = 2.0  # mV
    
    # Event probabilities per 24h period
    EVENT_PROBABILITIES = {
        'trips': 0.20,
        'pulgon': 0.15,
        'diaphorina': 0.03,  # Rare but critical
        'arana_roja': 0.15,
        'antracnosis': 0.10,
        'minador': 0.08,
        'hlb': 0.01,  # Very rare
    }
    
    # Signal characteristics by threat type
    SIGNAL_PROFILES = {
        'trips': {
            'delta_vmem': (12, 20),
            'duration_h': (2, 6),
            'freq_shift': (15, 25),
            'pattern': 'spike_sustained'
        },
        'pulgon': {
            'delta_vmem': (10, 25),
            'duration_h': (4, 12),
            'freq_shift': (5, 15),
            'pattern': 'gradual_sustained'
        },
        'diaphorina': {
            'delta_vmem': (18, 35),
            'duration_h': (1, 4),
            'freq_shift': (20, 30),
            'pattern': 'strong_vp'
        },
        'arana_roja': {
            'delta_vmem': (8, 15),
            'duration_h': (12, 48),
            'freq_shift': (3, 8),
            'pattern': 'slow_gradual'
        },
        'antracnosis': {
            'delta_vmem': (8, 20),
            'duration_h': (6, 24),
            'freq_shift': (2, 8),
            'pattern': 'gradual_sustained'
        },
        'minador': {
            'delta_vmem': (15, 30),
            'duration_h': (2, 8),
            'freq_shift': (10, 20),
            'pattern': 'local_ap'
        },
        'hlb': {
            'delta_vmem': (10, 20),
            'duration_h': (48, 168),
            'freq_shift': (0.5, 2),
            'pattern': 'baseline_shift'
        },
    }
    
    def __init__(self, seed: Optional[int] = None):
        """Initialize generator with optional seed for reproducibility."""
        if seed is not None:
            np.random.seed(seed)
            random.seed(seed)
        self.active_events: List[SyntheticEvent] = []
    
    def generate_vmem_series(
        self,
        hours: int = 24,
        sampling_interval_min: int = 15,
        section: str = "S1",
        include_events: bool = True
    ) -> Tuple[List[float], List[Dict], Dict]:
        """
        Generate a synthetic Vmem time series.
        
        Args:
            hours: Duration of series in hours
            sampling_interval_min: Sampling interval in minutes
            section: Farm section (affects event probability slightly)
            include_events: Whether to inject pest/disease events
        
        Returns:
            Tuple of (vmem_series, events_injected, metadata)
        """
        n_samples = int(hours * 60 / sampling_interval_min)
        t = np.linspace(0, hours, n_samples)
        
        # 1. Generate baseline with circadian rhythm
        # Peak at night (~2 AM), trough at noon
        circadian = self.DAILY_AMPLITUDE * np.sin(2 * np.pi * (t - 2) / 24)
        baseline = self.BASELINE_VMEM + circadian
        
        # 2. Add gaussian noise
        noise = np.random.normal(0, self.NOISE_STD, n_samples)
        vmem = baseline + noise
        
        # 3. Inject pest/disease events
        events_injected = []
        if include_events:
            vmem, events_injected = self._inject_events(vmem, t, hours, section)
        
        # 4. Calculate metadata
        metadata = {
            'section': section,
            'start_time': datetime.now() - timedelta(hours=hours),
            'end_time': datetime.now(),
            'n_samples': n_samples,
            'sampling_interval_min': sampling_interval_min,
            'baseline_vmem': self.BASELINE_VMEM,
            'events_count': len(events_injected),
            'mode': 'synthetic',
            'generator_version': '1.0'
        }
        
        return vmem.tolist(), events_injected, metadata
    
    def _inject_events(
        self,
        vmem: np.ndarray,
        t: np.ndarray,
        hours: int,
        section: str
    ) -> Tuple[np.ndarray, List[Dict]]:
        """Inject pest/disease events into the signal."""
        events = []
        
        # Adjust probabilities by section
        section_multiplier = {'S1': 1.0, 'S2': 0.9, 'S3': 0.8}.get(section, 1.0)
        
        for threat_type, base_prob in self.EVENT_PROBABILITIES.items():
            prob = base_prob * section_multiplier * (hours / 24)
            
            if random.random() < prob:
                event, vmem = self._create_event(vmem, t, threat_type, hours)
                if event:
                    events.append(event)
        
        return vmem, events
    
    def _create_event(
        self,
        vmem: np.ndarray,
        t: np.ndarray,
        threat_type: str,
        hours: int
    ) -> Tuple[Optional[Dict], np.ndarray]:
        """Create a single pest/disease event and modify the signal."""
        profile = self.SIGNAL_PROFILES[threat_type]
        
        # Determine event timing
        duration = random.uniform(*profile['duration_h'])
        if duration > hours * 0.8:
            duration = hours * 0.8
        
        start_hour = random.uniform(0, hours - duration)
        
        # Get indices for event window
        start_idx = int(start_hour * len(t) / hours)
        end_idx = int((start_hour + duration) * len(t) / hours)
        
        if end_idx <= start_idx:
            return None, vmem
        
        # Generate signal perturbation based on pattern
        amplitude = random.uniform(*profile['delta_vmem'])
        pattern = profile['pattern']
        
        event_signal = self._generate_pattern(
            end_idx - start_idx, pattern, amplitude
        )
        
        # Apply event to vmem (depolarization = more positive)
        vmem[start_idx:end_idx] += event_signal
        
        # Create event record
        event = {
            'threat_type': threat_type,
            'start_hour': round(start_hour, 1),
            'duration_hours': round(duration, 1),
            'amplitude_mv': round(amplitude, 1),
            'pattern': pattern,
            'injected_at': datetime.now().isoformat(),
            'confidence_expected': self._estimate_confidence(amplitude, threat_type)
        }
        
        return event, vmem
    
    def _generate_pattern(
        self,
        length: int,
        pattern: str,
        amplitude: float
    ) -> np.ndarray:
        """Generate signal pattern for a specific threat type."""
        x = np.linspace(0, 1, length)
        
        if pattern == 'spike_sustained':
            # Sharp rise, sustained, gradual decline
            signal = amplitude * (1 - np.exp(-10 * x)) * np.exp(-0.5 * x)
            
        elif pattern == 'gradual_sustained':
            # Gradual rise, sustained plateau
            signal = amplitude * (1 - np.exp(-3 * x))
            
        elif pattern == 'strong_vp':
            # Strong variation potential - rapid onset, oscillating
            signal = amplitude * (1 - np.exp(-8 * x)) * (1 + 0.2 * np.sin(20 * x))
            
        elif pattern == 'slow_gradual':
            # Very slow rise over hours/days
            signal = amplitude * x ** 0.5
            
        elif pattern == 'local_ap':
            # Action potential - sharp spike then decline
            signal = amplitude * np.exp(-((x - 0.2) ** 2) / 0.02)
            
        elif pattern == 'baseline_shift':
            # Gradual permanent shift (HLB)
            signal = amplitude * (1 / (1 + np.exp(-10 * (x - 0.3))))
            
        else:
            signal = amplitude * np.ones(length) * 0.5
        
        # Add micro-noise
        signal += np.random.normal(0, amplitude * 0.1, length)
        
        return signal
    
    def _estimate_confidence(self, amplitude: float, threat_type: str) -> float:
        """Estimate expected detection confidence based on amplitude."""
        profile = self.SIGNAL_PROFILES[threat_type]
        min_amp, max_amp = profile['delta_vmem']
        
        # Normalize amplitude to 0-1 range
        normalized = (amplitude - min_amp) / (max_amp - min_amp)
        
        # Base confidence + amplitude bonus
        base_conf = 0.55
        conf = base_conf + normalized * 0.35
        
        return round(min(0.95, conf), 2)
    
    def generate_environmental_series(
        self,
        hours: int = 24,
        sampling_interval_min: int = 15,
        base_temp: float = 26.0,
        base_humidity: float = 70.0
    ) -> Tuple[List[float], List[float]]:
        """
        Generate synthetic temperature and humidity series.
        
        Uses realistic daily patterns for Veracruz climate.
        """
        n_samples = int(hours * 60 / sampling_interval_min)
        t = np.linspace(0, hours, n_samples)
        
        # Temperature: peak at 2 PM (14:00), minimum at 5 AM
        temp_amplitude = 6.0  # °C
        temp = base_temp + temp_amplitude * np.sin(2 * np.pi * (t - 8) / 24)
        temp += np.random.normal(0, 0.5, n_samples)
        
        # Humidity: inverse of temperature roughly
        hum_amplitude = 15.0  # %
        humidity = base_humidity - hum_amplitude * np.sin(2 * np.pi * (t - 8) / 24)
        humidity += np.random.normal(0, 2, n_samples)
        humidity = np.clip(humidity, 40, 98)
        
        return temp.tolist(), humidity.tolist()


def generate_demo_data(section: str = "S1", hours: int = 24) -> Dict:
    """
    Generate complete demo dataset for the UI.
    
    Returns a dictionary ready for API response.
    """
    generator = SyntheticVmemGenerator(seed=None)  # Random each time
    
    vmem, events, metadata = generator.generate_vmem_series(
        hours=hours,
        section=section,
        include_events=True
    )
    
    temp, humidity = generator.generate_environmental_series(
        hours=hours,
        base_temp=26.0,
        base_humidity=70.0
    )
    
    # Calculate summary statistics
    vmem_arr = np.array(vmem)
    
    return {
        'section': section,
        'mode': 'synthetic',
        'timestamp': datetime.now().isoformat(),
        'series': {
            'vmem': vmem,
            'temperature': temp,
            'humidity': humidity,
            'timestamps': [
                (datetime.now() - timedelta(hours=hours) + timedelta(minutes=i*15)).isoformat()
                for i in range(len(vmem))
            ]
        },
        'statistics': {
            'vmem_current': round(vmem[-1], 2),
            'vmem_mean': round(float(np.mean(vmem_arr)), 2),
            'vmem_std': round(float(np.std(vmem_arr)), 2),
            'vmem_min': round(float(np.min(vmem_arr)), 2),
            'vmem_max': round(float(np.max(vmem_arr)), 2),
            'delta_vmem_6h': round(vmem[-1] - vmem[-24] if len(vmem) >= 24 else 0, 2),
            'temp_current': round(temp[-1], 1),
            'humidity_current': round(humidity[-1], 1),
        },
        'injected_events': events,
        'metadata': metadata
    }


# CLI for testing
if __name__ == "__main__":
    import json
    
    print("Generating synthetic demo data...")
    for section in ['S1', 'S2', 'S3']:
        data = generate_demo_data(section, hours=24)
        print(f"\n{section}:")
        print(f"  Vmem current: {data['statistics']['vmem_current']} mV")
        print(f"  ΔVmem 6h: {data['statistics']['delta_vmem_6h']} mV")
        print(f"  Events injected: {len(data['injected_events'])}")
        for event in data['injected_events']:
            print(f"    - {event['threat_type']}: {event['amplitude_mv']} mV, {event['duration_hours']}h")
