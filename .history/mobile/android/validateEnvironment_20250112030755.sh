#!/bin/bash

echo "Validating Android build environment..."

# Check Java version
java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
if [[ ! $java_version == 11* ]]; then
    echo "Error: Java 11 is required (found $java_version)"
    exit 1
fi

# Check Gradle version
gradle_version=$(./gradlew -v | grep "Gradle" | cut -d' ' -f2)
if [[ ! $gradle_version == 7.6* ]]; then
    echo "Error: Gradle 7.6.x is required (found $gradle_version)"
    exit 1
fi

# Verify NDK installation
if [ ! -d "$ANDROID_HOME/ndk/23.1.7779620" ]; then
    echo "Error: NDK 23.1.7779620 not found"
    exit 1
fi

echo "Environment validation passed!" 