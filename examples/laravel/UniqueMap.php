<?php

/**
 * xSROMap Livewire Component Example
 * 
 * Copy to: app/Livewire/UniqueMap.php
 * 
 * Usage in blade: <livewire:unique-map />
 */

namespace App\Livewire;

use Livewire\Component;

class UniqueMap extends Component
{
    public $selectedMob = '';
    public $mobs = [];

    public function mount()
    {
        // Load your mobs data here
        // This is example data - replace with your actual data source
        $this->mobs = [
            [
                'code' => 'MOB_CH_TIGERWOMAN',
                'name' => 'Tiger Girl',
                'spawns' => [
                    ['x' => 5500, 'y' => 1200, 'z' => 0, 'region' => 25001],
                    ['x' => 5600, 'y' => 1300, 'z' => 0, 'region' => 25001],
                ]
            ],
            [
                'code' => 'MOB_OA_URUCHI',
                'name' => 'Uruchi',
                'spawns' => [
                    ['x' => 2500, 'y' => 500, 'z' => 0, 'region' => 24500],
                ]
            ],
            [
                'code' => 'MOB_KK_ISYUTARU',
                'name' => 'Isyutaru',
                'spawns' => [
                    ['x' => -1000, 'y' => 200, 'z' => 0, 'region' => 23500],
                    ['x' => -1100, 'y' => 250, 'z' => 0, 'region' => 23500],
                    ['x' => -900, 'y' => 180, 'z' => 0, 'region' => 23500],
                ]
            ],
        ];
    }

    public function updatedSelectedMob($value)
    {
        if (empty($value)) {
            return;
        }

        $mob = collect($this->mobs)->firstWhere('code', $value);
        
        if ($mob) {
            // Dispatch event to JavaScript
            $this->dispatch('mobSelected', [
                'code' => $mob['code'],
                'name' => $mob['name'],
                'spawns' => $mob['spawns'],
            ]);
        }
    }

    public function flyTo($x, $y, $z = null, $region = null)
    {
        $this->dispatch('flyToLocation', [
            'x' => $x,
            'y' => $y,
            'z' => $z,
            'region' => $region,
        ]);
    }

    public function render()
    {
        return view('livewire.unique-map');
    }
}
