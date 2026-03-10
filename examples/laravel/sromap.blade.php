{{--
    xSROMap Blade Component
    
    Copy to: resources/views/components/sromap.blade.php
    
    Usage:
        <x-sromap />
        <x-sromap id="my-map" x="6434" y="1044" height="600px" />
        <x-sromap :wire="true" />  {{-- For Livewire components --}}
--}}

@props([
    'id' => 'sromap-' . uniqid(),
    'x' => 114,
    'y' => 47.25,
    'z' => null,
    'region' => null,
    'imghost' => '/storage/minimap/',
    'height' => '500px',
    'width' => '100%',
    'class' => '',
    'wire' => false,
    'autoInit' => true,
])

<div 
    id="{{ $id }}"
    @if($autoInit) data-sromap @endif
    data-x="{{ $x }}"
    data-y="{{ $y }}"
    @if($z) data-z="{{ $z }}" @endif
    @if($region) data-region="{{ $region }}" @endif
    data-imghost="{{ $imghost }}"
    {{ $attributes->merge(['class' => 'sromap-container ' . $class]) }}
    style="height: {{ $height }}; width: {{ $width }}; display: block; background: #000;"
    @if($wire) wire:ignore @endif
></div>

{{ $slot }}
