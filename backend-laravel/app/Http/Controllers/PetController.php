<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PetController extends Controller
{
    public function index()
    {
        $pets = Pet::where('customer_id', Auth::id())->get();
        return response()->json($pets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:dog,cat,bird,rabbit,other',
            'breed' => 'nullable|string|max:100',
            'age' => 'nullable|integer',
            'allergies' => 'nullable|string',
        ]);

        $pet = Pet::create([
            'customer_id' => Auth::id(),
            'name' => $request->name,
            'type' => $request->type,
            'breed' => $request->breed,
            'age' => $request->age,
            'allergies' => $request->allergies,
        ]);

        return response()->json([
            'message' => 'Pet added successfully',
            'pet' => $pet,
        ], 201);
    }

    public function show($id)
    {
        $pet = Pet::where('customer_id', Auth::id())->findOrFail($id);
        return response()->json($pet);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:dog,cat,bird,rabbit,other',
            'breed' => 'nullable|string|max:100',
            'age' => 'nullable|integer',
            'allergies' => 'nullable|string',
        ]);

        $pet = Pet::where('customer_id', Auth::id())->findOrFail($id);
        $pet->update($request->all());

        return response()->json([
            'message' => 'Pet updated successfully',
            'pet' => $pet,
        ]);
    }

    public function destroy($id)
    {
        $pet = Pet::where('customer_id', Auth::id())->findOrFail($id);
        $pet->delete();

        return response()->json(['message' => 'Pet deleted successfully']);
    }
}
